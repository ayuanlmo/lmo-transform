// 获取视频文件第一帧
import AppConfig from "../conf/AppConfig";
import Storage from "../lib/Storage";
import {FFPLAY_BIN_PATH} from "./ffmpeg";
import {FIRST_FRAME_ERROR, PLAYER_ERROR, TRANSFORM_ERROR} from "../const/Message";

const ffmpeg = window.require('fluent-ffmpeg');
const fs = window.require('fs');
const {ipcRenderer} = window.require('electron');
const child_process = window.require('child_process')

export const getVideoFirstFrame = (inputFilePath: string) => {
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

export const getFileInfo = (filePath: string): Promise<any> => {
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

export const transformVideo = (data: any): Promise<any> => {
    const inputFile: string = data.path;
    const outputPath: string = Storage.Get('output_path');

    return new Promise((resolve, reject) => {
        const optFile: string = outputPath + "\\" + data.name.split('.')[0] + '.' + data.output.type;

        ffmpeg(inputFile).output(optFile)
            .on('end', function () {
                resolve(optFile);
            })
            .on('error', function (err: any) {
                reject('error');
                ipcRenderer.send('SHOW-ERROR-MESSAGE-BOX', {
                    msg: TRANSFORM_ERROR(inputFile, err)
                });
            }).run();
    });
}

export const ffplayer = (path: string) => {
    const cmd: string = `${FFPLAY_BIN_PATH} ${path}`;

    child_process.exec(cmd, (err: any) => {
        if (err)
            ipcRenderer.send('SHOW-ERROR-MESSAGE-BOX', {
                msg: PLAYER_ERROR(path, err)
            });
    })
}