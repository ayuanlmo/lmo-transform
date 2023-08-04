// 获取视频文件第一帧
export const getVideoFirstFrame = (inputFilePath: string) => {
    return new Promise((resolve, reject) => {
        const ffmpeg = window.require('fluent-ffmpeg');
        ffmpeg(inputFilePath).screenshots({
            count: 1,
            timestamps: ['100%', '00:00:00'],
            filename: `lmo-tmp-%s-${new Date().getTime()}.png`,
            folder: 'tmp/',
            size: '50%'
        }).on('filenames', function (filenames: any) {
            resolve(window.require('path').resolve('tmp/', filenames[0]))
        }).on('end', function (e: any) {
            reject(e);
        });
    })
}