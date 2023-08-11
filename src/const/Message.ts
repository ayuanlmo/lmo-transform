export const FILE_ERROR_MESSAGE = (filePath: string, msg: string): string => {
    return `程序遇到了一个错误，[${filePath}]貌似是一个不受到支持的文件，或者它已损坏\n\n详细信息：\n\n` + msg;
}
