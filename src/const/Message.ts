export const FILE_ERROR_MESSAGE = (filePath: string, msg: string): string => {
    return `程序遇到了一个错误，[${filePath}]貌似是一个不受到支持的文件，或者它已损坏\n\n详细信息：\n\n` + msg;
}

export const TRANSFORM_ERROR = (filePath: string, msg: string): string => {
    return `[${filePath}]文件转换出现以下错误：\n\n` + msg;
}

export const PLAYER_ERROR = (filePath: string, msg: string): string => {
    return `[${filePath}]文件无法播放：\n\n详细信息：\n\n` + msg;
}

export const FIRST_FRAME_ERROR = (filePath: string, msg: string): string => {
    return `[${filePath}]成首帧预览图错误：\n\n详细信息：\n\n` + msg;
}
