interface Ffmpeg {
    (...arg: any): FfmpegCall;

    setFfmpegPath(path: string): void;

    length: number;

    setFfprobePath(path: string): void;

    setFlvtoolPath(path: string): void;

    getAvailableCodecs: (cb: (err: any, codes: object) => void) => void;

    ffprobe(path: string, cb: (e: any, data: FfmpegStreamsTypes) => void): void;

}

interface FfmpegCall {
    inputFormat(format: string): FfmpegCall; // 输入格式
    inputFPS(fps: string | number): FfmpegCall; // 输入帧率
    native(): FfmpegCall; // 原生帧速率输入
    seekInput(seek: number | string): FfmpegCall; // 输入开始时间
    inputOption(...options: Array<string> | string[][]): FfmpegCall; // 输入选项
    noAudio(): FfmpegCall; // 禁用音频
    withAudioCodec(codec: string): FfmpegCall; // 设置音频编解码器
    withAudioBitrate(bitrate: string | number): FfmpegCall; // 设置音频比特率
    withAudioChannels(channels: string | number): FfmpegCall; // 设置音频通道计数
    withAudioFrequency(freq: string | number): FfmpegCall; // 设置音频频率（以hz为单位
    audioFilters(...filters: Array<string> | string[][]): FfmpegCall; // 音频过滤器
    noVideo(): FfmpegCall; // 禁用视频
    withVideoCodec(codec: string): FfmpegCall; // 设置视频编解码器
    withVideoBitrate(bitrate: string | number): FfmpegCall; // 设置视频比特率
    videoFilter(...filters: Array<string> | Array<{
        filter: string;
        options: string | Array<string> | { w: number; h: number; y: number; color: string };
    }>): FfmpegCall; // 视频过滤器
    withOutputFps(fps: number): FfmpegCall; // 设置输出帧率
    withSize(size: string): FfmpegCall & { aspect(p: string | number): void; }; // 设置输出帧大小
    autopad(pad?: boolean, color?: string): FfmpegCall;

    output(target: string, pipeopts?: any): FfmpegCall; // 输出
    outputOptions: (options: string | Array<string>) => FfmpegCall; // 输出选项
    withDuration(duration: number | string): FfmpegCall; // 输出持续时间
    format(duration: number | string): FfmpegCall; // 输出格式
    flvmeta(): FfmpegCall; // 转码后更新FLV元数据
    outputOption(...arg: (Array<string> | string)[]): FfmpegCall; // 输出选项
    on(type: string, listener: (data: any) => void): FfmpegCall; // 事件侦听器
    run(): void; // 开始
    exec(): void; // 开始
    kill(p?: string): void; // 杀死ffmpeg进程
    screenshots: (d: {
        count: number;
        timestamps: string | Array<string>;
        filename: string;
        folder: string;
        size: string;
    }) => FfmpegCall;// 截图

    keepDAR(): [
        {
            filter: 'scale';
            options: {
                w: 'if(gt(sar,1),iw*sar,iw)';
                h: 'if(lt(sar,1),ih/sar,ih)';
            }
        },
        {
            filter: 'setsar';
            options: '1';
        }
    ]; // 强制保持显示横纵比
    input(source: string): FfmpegCall; // 输入
    addInput(source: string): FfmpegCall; // 输入
    addInput(source: string): FfmpegCall; // 输入
}

import {FfmpegStreamsTypes} from "./ff";
import Global from "../lib/Global";
import * as Path from 'path';

const ffmpeg: Ffmpeg = Global.requireNodeModule('fluent-ffmpeg');
const {resolve} = Global.requireNodeModule<typeof Path>('path');
const FFMPEG_BIN_PATH: string = resolve('./ffmpeg/ffmpeg.exe');
const FFPROBE_BIN_PATH: string = resolve('./ffmpeg/ffprobe.exe');
const FFPLAY_BIN_PATH: string = resolve('./ffmpeg/ffplay.exe');

ffmpeg.setFfmpegPath(FFMPEG_BIN_PATH);
ffmpeg.setFfprobePath(FFPROBE_BIN_PATH);

export {Ffmpeg};
export {FfmpegCall};
export {FFMPEG_BIN_PATH};
export {FFPROBE_BIN_PATH};
export {FFPLAY_BIN_PATH};
