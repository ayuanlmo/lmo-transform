const ffmpeg = window.require('fluent-ffmpeg');
const {resolve} = window.require('path');
export const FFMPEG_BIN_PATH: string = resolve('./ffmpeg/ffmpeg.exe');
export const FFPROBE_BIN_PATH: string = resolve('./ffmpeg/ffprobe.exe');

ffmpeg.setFfmpegPath(FFMPEG_BIN_PATH);
ffmpeg.setFfprobePath(FFPROBE_BIN_PATH);
