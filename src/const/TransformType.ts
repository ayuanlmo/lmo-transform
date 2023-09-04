const videoIconPath: string = require('../static/svg/menu/video.svg').default;
const audioIconPath: string = require('../static/svg/menu/audio.svg').default;

export type TRANSFORM_TYPES = 'video' | 'audio';
export const TRANSFORM_MAP: Array<{ name: string, type: TRANSFORM_TYPES, icon: string }> = [
    {name: '视频转换', type: 'video', icon: videoIconPath},
    {name: '音频转换', type: 'audio', icon: audioIconPath}
];
