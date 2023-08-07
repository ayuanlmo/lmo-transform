// 获取视频文件第一帧
import AppConfig from "../conf/AppConfig";
import {ResolvePath} from "../utils";

const ffmpeg = window.require('fluent-ffmpeg');

export const getVideoFirstFrame = (inputFilePath: string) => {
    return new Promise((resolve, reject) => {
        const ffmpeg = window.require('fluent-ffmpeg');
        const tmpPath: string = `${AppConfig.system.tempPath}${AppConfig.appName}`;
        ffmpeg(inputFilePath).screenshots({
            count: 1,
            timestamps: ['100%', '00:00:00'],
            filename: `lmo-tmp-%s-${new Date().getTime()}.png`,
            folder: `${tmpPath}/tmp`,
            size: '50%'
        }).on('filenames', function (filenames: any) {
            resolve(window.require('path').resolve(ResolvePath(tmpPath), filenames[0]))
        }).on('end', function (e: any) {
            reject(e);
        });
    })
}

export const getFileInfo = (filePath: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (e, data) => {
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
