import Storage from "../lib/Storage";

const __G = global || window || this;
const {shell} = __G.require('electron');

export const RequireNodeModule = (name: string): any => __G.require(name);

export const ToString = <T>(data: T): string => {
    const typeHandlers = {
        boolean: (data: boolean) => `${data}`,
        string: (data: string) => data,
        number: (data: number) => `${data}`,
        object: (data: object) => IsObject(data) ? Stringify(data) : ''
    };

    const type = typeof data;

    if (typeHandlers.hasOwnProperty(type)) {
        // @ts-ignore
        return typeHandlers[type](data);
    }
    return '';
}

export const IsArray = (arr: Array<any>): boolean => Object.prototype.toString.call(arr) === "[object Array]";

export const IsString = (str: string): boolean => typeof str === 'string';

export const Stringify = (data: Object): string => data === null ? 'null' : JSON.stringify(data);

export const IsObject = (data: Object): boolean => typeof data === 'object' && data !== null && !Array.isArray(data);

/**
 * @method CMD_Exists
 * @param {string} cmd - 命令
 * @returns {Boolean}
 * @author ayuanlmo
 * @description cmd 是否存在于操作系统
 * **/
// 命令是否存在于操作系统
export const CMD_Exists = (cmd: string): boolean => {
    try {
        RequireNodeModule('child_process').execSync(RequireNodeModule('os').platform() === 'win32'
            ? `cmd /c "(help ${cmd} > nul || exit 0) && where ${cmd} > nul 2> nul"`
            : `command -v ${cmd}`);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * @method Exec_CMD
 * @param {string} cmd - 命令
 * @param {} opt - 参数
 * @returns {Promise}
 * @description 执行cmd命令
 * **/
export const Exec_CMD = (cmd: string, opt?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        try {
            RequireNodeModule('child_process').exec(cmd, opt, (e: any, stdout: string) => {
                if (!e)
                    resolve(stdout);
            });
        } catch (e) {
            reject(e);
        }
    });
}

// 转换路径
export const ResolvePath = (path: string) => {
    return path.split('\\').join('/')
}

// 移除Array中某一项
export const SpliceArray = <T>(arr: Array<T>, index: number): Array<T> => {
    if (index > -1 && index < arr.length)
        return arr.slice(0, index).concat(arr.slice(index + 1));
    return arr;
}

/**
 * @method ResolveSize
 * @param {number} size -文件大小
 * @returns {string} - 1M
 * @author ayuanlmo
 * @description 文件大小转换成兆
 * **/
export const ResolveSize = (size: number): string => {
    return (size / 1024 / 1024).toFixed(2).toString() + 'M';
}

/**
 * @method FormatSec
 * @param {number} sec - 秒
 * @returns {string} - 00:00:00
 * @author ayuanlmo
 * @description 格式化秒(HH:MM:SS)
 * **/
export const FormatSec = (sec: number): string => {
    const h: number = Math.floor(sec / 3600);
    const m: number = Math.floor((sec % 3600) / 60);
    const s: number = Math.floor(sec % 60);

    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

// 打开输出路径
export const openOutputPath = (): void => {
    shell.openPath(Storage.Get('output_path'));
}

// 播放bibi声音
export const playBeep = (): void => {
    shell.beep();
}