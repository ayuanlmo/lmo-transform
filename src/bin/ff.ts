// 获取视频文件第一帧
import AppConfig from "../conf/AppConfig";

const ffmpeg = window.require('fluent-ffmpeg');
const fs = window.require('fs');

export const getVideoFirstFrame = (inputFilePath: string) => {
    return new Promise((resolve, reject) => {
        const ffmpeg = window.require('fluent-ffmpeg');
        const tmpPath: string = `${AppConfig.system.tempPath}${AppConfig.appName}`;
        const fileName: string = `lmo-tmp-${new Date().getTime()}.y.png`;

        // 可能会存在文件还未正常写入磁盘，导致的页面无显示问题
        // 所以这里放一个侦听器，让页面等待这个侦听器
        fs.watch(`${tmpPath}/tmp`, (type, name) => {
            resolve(`${tmpPath}/tmp/${name}`);
        });

        ffmpeg(inputFilePath).screenshots({
            count: 1,
            timestamps: ['100%', '00:00:00'],
            filename: fileName,
            folder: `${tmpPath}/tmp`,
            size: '50%'
        }).on('end', function (e: any) {
            if (e)
                console.log('生成首帧图错误', e);
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
