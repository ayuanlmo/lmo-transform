// 获取视频文件第一帧
import AppConfig from "../conf/AppConfig";
import Storage from "../lib/Storage";
import {FFPLAY_BIN_PATH} from "./ffmpeg";
import {FIRST_FRAME_ERROR, PLAYER_ERROR, TRANSFORM_ERROR} from "../const/Message";
import {playBeep} from "../utils";

const ffmpeg = window.require('fluent-ffmpeg');
const fs = window.require('fs');
const {ipcRenderer} = window.require('electron');
const child_process = window.require('child_process');

export interface GetFileInfoTypes {
    size: number | string;
    duration: number;
    width: number;
    height: number;
    format: Array<string>;
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

/**
 * @method getVideoFirstFrame
 * @param {string} inputFilePath - 文件路径
 * @returns {Promise<string>} - 第一帧路径
 * @author ayuanlmo
 * @description 获取视频第一帧
 * **/
export const getVideoFirstFrame = (inputFilePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const ffmpeg = window.require('fluent-ffmpeg');
        const tmpPath: string = `${AppConfig.system.tempPath}${AppConfig.appName}`;
        const fileName: string = `lmo-tmp-${new Date().getTime()}.y.png`;

        // 可能会存在文件还未正常写入磁盘，导致的页面无显示问题
        // 所以这里放一个侦听器，让页面等待这个侦听器
        fs.watch(`${tmpPath}/tmp`, (type: string, name: string) => {
            resolve(`${tmpPath}/tmp/${name}`);
        });

        ffmpeg(inputFilePath).screenshots({
            count: 1,
            timestamps: ['100%', '00:00:00'],
            filename: fileName,
            folder: `${tmpPath}/tmp`,
            size: '50%'
        }).on('end', function (e: any) {
            if (e) {
                ipcRenderer.send('SHOW-ERROR-MESSAGE-BOX', {
                    msg: FIRST_FRAME_ERROR(inputFilePath, e.toString())
                });
                console.log('生成首帧图错误', e);
            }

        }).on('error', function (e: any) {
            reject({err: true, msg: e, file: inputFilePath});
        })
    })
}

/**
 * @method getFileInfo
 * @param {string} filePath - 文件路径
 * @returns {Promise<{size:number,duration:number,width:number,height:number,format:[]>}>}
 * @description 获取文件信息
 * **/
export const getFileInfo = (filePath: string): Promise<GetFileInfoTypes> => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (e: any, data: any) => {
            if (e) {
                console.log('获取文件信息错误', e);
                return reject({});
            }
            resolve({
                size: data.format.size,
                duration: data.format.duration,
                width: data.streams[0].width,
                height: data.streams[0].height,
                format: data.format.format_name
            });
        });
    });
}


/**
 * @method transformVideo
 * @param {Object} data - 视频基本信息(通过getFileInfo 获取)
 * @param {Function} callback - 转换进度回调
 * @author ayuanlmo
 * @returns {Promise<string>}
 * @description 转换视频
 * **/
export const transformVideo = (data: any, callback: Function): Promise<any> => {
    const inputFile: string = data.path;
    const libs: string = data.output.libs;
    const outputPath: string = Storage.Get('output_path') as string;

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
        console.log(_ffmpeg);
        _ffmpeg.on('progress', (progress: any) => {
            const currentDuration: number = duration * progress.percent / 100;  // 已转换的视频时长（单位：秒）
            const _ = Number(((currentDuration / duration) * 100).toFixed());

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
    const cmd: string = `${FFPLAY_BIN_PATH} ${path}`;

    child_process.exec(cmd, (err: any): void => {
        if (err)
            ipcRenderer.send('SHOW-ERROR-MESSAGE-BOX', {
                msg: PLAYER_ERROR(path, err)
            });
    })
}

// 获取可用的编解码器
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
                    _.push({...codes[i]})
                    console.log('音频')
                }
            });
            resolve(_);
        })
    });
}