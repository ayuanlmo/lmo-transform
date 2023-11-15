import AppConfig from "../conf/AppConfig";
import {Ffmpeg, FFPLAY_BIN_PATH} from "./ffmpeg";
import {FIRST_FRAME_ERROR, PLAYER_ERROR, TRANSFORM_ERROR} from "../const/Message";
import {playBeep} from "../utils";
import * as FS from 'fs';
import * as Electron from 'electron';
import * as ChildProcess from 'child_process';
import Global from "../lib/Global";

export interface FfmpegStreamsTypes {
    avg_frame_rate: string;// 帧速率
    bit_rate: number; // 比特率
    bits_per_raw_sample: number; // 原始样本
    chroma_location: 'left' | 'center' | 'topleft'; // 色度( 基于MPEG-2 规范
    closed_captions: number; // 隐式字幕
    codec_long_name: string; // 编解码器长名称 (例如：H264 / AVC / MPEG-4 AVC..
    codec_name: string; // 编解码器名称 (例如：h264
    codec_tag: string; // 编解码器标签
    codec_tag_string: string; // 编解码器标签字符串
    codec_type: 'video' | 'audio' | 'subtitle' | 'data'; // 编解码器类型 （视频(流)、音频(流)、字幕(流)、数据(流）
    coded_height: number; // 编码高度
    coded_width: number; // 编码宽度
    color_primaries: 'bt709' | 'bt470m' | 'bt470bg' | 'smpte170m' | 'smpte240m'; // 色彩原色
    color_range: 'tv' | 'limited' | 'full';// 色彩范围
    color_space: 'bt709' | 'bt601' | 'srgb' | 'bt2020nc' | 'smpte170m' | 'smpte240m'; // 色彩空间
    color_transfer: string; // 视频滤镜
    display_aspect_ratio: string;// 显示宽高比
    duration: number; // 持续时间
    duration_ts: number; // 流持续时间
    extradata_size: number; // 额外数据大小
    field_order: string; // 字段顺序
    film_grain: string; // 胶片颗粒
    has_b_frames: number; // B帧
    height: number; // 高度
    id: string; // id
    index: number; // 索引
    is_avc: 'true' | 'false'; // 是AVC
    level: number; // 登记
    max_bit_rate: string | number; // 最大比特率
    nal_length_size: number; // 最终长度大小
    nb_frames: number; // 视频流中的帧数（包含 I帧 、P帧 、 B帧
    start_pts: number; // 开始时间戳
    start_time: number;// 开始时间
    tags: {
        creation_time: string; // 创建时间
        encoder: string; // 编码器
        handler_name: string; // 处理程序名
        language: string; // 语言
        vendor_id: string; // ?
    }
    time_base: string; // 时基
    width: number; // 宽度
}

export interface GetFileInfoTypes {
    size: number | string;
    duration: number;
    width: number;
    height: number;
    format: Array<string>;
    streams: FfmpegStreamsTypes;
}

export interface Codes {
    canDecode: boolean; // 可解码
    canEncode: boolean;// 可编码
    description: string;// 描述
    isLossless: boolean;// 无损
    isLossy: boolean;// 有损
    type: 'audio' | 'video';// 有损
    intraFrameOnly?: boolean;// 仅帧内
}

const ffmpeg: Ffmpeg = Global.requireNodeModule('fluent-ffmpeg');
const fs = Global.requireNodeModule<typeof FS>('fs');
const {ipcRenderer} = Global.requireNodeModule<typeof Electron>('electron');
const child_process = Global.requireNodeModule<typeof ChildProcess>('child_process');

/**
 * @method getVideoFirstFrame
 * @param {string} inputFilePath - 文件路径
 * @returns {Promise<string>} - 第一帧路径
 * @author ayuanlmo
 * @description 获取视频第一帧
 * **/
export const getVideoFirstFrame = (inputFilePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const ffmpeg: Ffmpeg = Global.requireNodeModule<Ffmpeg>('fluent-ffmpeg');
        const tmpPath: string = `${AppConfig.system.tempPath}${AppConfig.appName}`;
        const fileName: string = `lmo-tmp-${new Date().getTime()}.y.png`;

        // 可能会存在文件还未正常写入磁盘，导致的页面无显示问题
        // 所以这里放一个侦听器，让页面等待这个侦听器
        // @ts-ignore
        fs.watch(`${tmpPath}/tmp`, (type: name, name: string): void => {
            resolve(`${tmpPath}/tmp/${name}`);
        });

        ffmpeg(inputFilePath).screenshots({
            count: 1,
            timestamps: ['1%', '00:00:00'],
            filename: fileName,
            folder: `${tmpPath}/tmp`,
            size: '230x130'
        }).on('end', function (e: any) {
            if (e) {
                ipcRenderer.send('SHOW-ERROR-MESSAGE-BOX', {
                    msg: FIRST_FRAME_ERROR(inputFilePath, e.toString())
                });
                console.log('生成首帧图错误', e);
            }

        }).on('error', function (e: any): void {
            reject({err: true, msg: e, file: inputFilePath});
        })
    })
}

/**
 * @method getFileInfo
 * @param {string} filePath - 文件路径
 * @returns {Promise<{size:number,duration:number,width:number,height:number,format:[],streams:<FfmpegStreamsTypes>>}>}
 * @description 获取文件信息
 * **/
export const getFileInfo = (filePath: string): Promise<GetFileInfoTypes> => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (e: any, data: any): void => {
            if (e) {
                reject(e);
            } else {
                resolve({
                    size: data.format.size,
                    duration: data.format.duration,
                    width: data.streams[0].width,
                    height: data.streams[0].height,
                    format: data.format.format_name,
                    streams: data.streams[0]
                });
            }
        });
    });
}

/**
 * @method transformVideo
 * @param {Object} data - 视频基本信息(通过getFileInfo 获取)
 * @param {Function} callback - 转换进度回调
 * @param {String} opt_path - 输出路径
 * @author ayuanlmo
 * @returns {Promise<string>}
 * @description 转换视频
 * **/
export const transformVideo = (data: any, callback: Function, opt_path: string): Promise<any> => {
    const inputFile: string = data.path;
    const libs: string = data.output.libs;
    const outputPath: string = opt_path;
    
    return new Promise((resolve, reject) => {
        const optFile: string = outputPath + "\\" + data.name.split('.')[0] + '.' + data.output.type;
        const duration: number = parseFloat(data.duration);
        let current: number = 0;
        const _ffmpeg = ffmpeg(inputFile);

        if (libs !== '' && libs !== undefined)
            _ffmpeg.outputOptions(libs);

        _ffmpeg.output(optFile);
        _ffmpeg.on('end', function () {
            playBeep();
            callback({
                current: 100,
                frame: []
            });
            resolve(optFile);
        })
        _ffmpeg.on('progress', (progress: any) => {
            const currentDuration: number = duration * progress.percent / 100;  // 已转换的视频时长（单位：秒）
            const _: number = Number(((currentDuration / duration) * 100).toFixed());

            if (current !== _) {
                current = _;
                callback({
                    current: current,
                    frame: [currentDuration.toFixed(), duration.toFixed]
                });
            }
        })
        _ffmpeg.on('error', function (err: any) {
            reject('error');
            ipcRenderer.send('SHOW-ERROR-MESSAGE-BOX', {
                msg: TRANSFORM_ERROR(inputFile, err)
            });
        }).run();
    });
}

/**
 * @method ffplayer
 * @param {string} path - 文件路径
 * @description 使用ffplay播放
 * **/
export const ffplayer = (path: string): void => {
    const cmd: string = `${FFPLAY_BIN_PATH}  -y 800 "${path}"`;

    child_process.exec(cmd, (err: any): void => {
        if (err)
            ipcRenderer.send('SHOW-ERROR-MESSAGE-BOX', {
                msg: PLAYER_ERROR(path, err)
            });
    });
}

/**
 * @method getAvailableCodecs
 * @author ayuanlmo
 * @description 获取可用的编解码器
 * @return Promise<Array<Codes>>
 * **/
export const getAvailableCodecs = (): Promise<Array<Codes>> => {
    return new Promise((resolve): void => {
        ffmpeg.getAvailableCodecs(function (err: any, codes: any) {
            const _: Array<Codes> = [];

            if (err) {
                resolve([]);
            }
            Object.keys(codes).forEach((i: string) => {
                const {type} = codes[i];

                if (type === 'audio' || type === 'video') {
                    _.push({...codes[i]});
                }
            });
            resolve(_);
        })
    });
}
