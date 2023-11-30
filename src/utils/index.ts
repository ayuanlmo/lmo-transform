import * as Electron from 'electron';
import * as ChildProcess from 'child_process';
import * as OS from 'os';
import Global from "../lib/Global";

const {shell} = Global.requireNodeModule<typeof Electron>('electron');
const {exec} = Global.requireNodeModule<typeof ChildProcess>('child_process');

const ToString = <T>(data: T): string => {
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

const IsArray = (arr: Array<any>): boolean => Object.prototype.toString.call(arr) === "[object Array]";

const IsString = (str: string): boolean => typeof str === 'string';

const Stringify = (data: Object): string => data === null ? 'null' : JSON.stringify(data);

const IsObject = (data: Object): boolean => typeof data === 'object' && data !== null && !Array.isArray(data);

/**
 * @method CMD_Exists
 * @param {string} cmd - 命令
 * @returns {Boolean}
 * @author ayuanlmo
 * @description cmd 是否存在于操作系统
 * **/
// 命令是否存在于操作系统
const CMD_Exists = (cmd: string): boolean => {
    try {
        Global.requireNodeModule<typeof ChildProcess>('child_process').execSync(Global.requireNodeModule<typeof OS>('os').platform() === 'win32'
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
const Exec_CMD = (cmd: string, opt?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        try {
            Global.requireNodeModule<typeof ChildProcess>('child_process').exec(cmd, opt, (e: any, stdout: string) => {
                if (!e)
                    resolve(stdout);
            });
        } catch (e) {
            reject(e);
        }
    });
}

// 转换路径
const ResolvePath = (path: string) => {
    return path.split('\\').join('/')
}

// 移除Array中某一项
const SpliceArray = <T>(arr: Array<T>, index: number): Array<T> => {
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
const ResolveSize = (size: number): string => {
    return (size / 1024 / 1024).toFixed(2).toString() + 'M';
}

/**
 * @method FormatSec
 * @param {number} sec - 秒
 * @returns {string} - 00:00:00
 * @author ayuanlmo
 * @description 格式化秒(HH:MM:SS)
 * **/
const FormatSec = (sec: number): string => {
    const h: number = Math.floor(sec / 3600);
    const m: number = Math.floor((sec % 3600) / 60);
    const s: number = Math.floor(sec % 60);

    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

// 打开输出路径
const openOutputPath = (path: string = ''): void => {
    exec(`explorer /select, "${path}"`);
}

// 播放bibi声音
const playBeep = (): void => {
    shell.beep();
}

// 获取当前时间
const getCurrentDateTime = (): string => {
    const now: Date = new Date();
    const year: number = now.getFullYear();
    const month: string = String(now.getMonth() + 1).padStart(2, '0');
    const day: string = String(now.getDate()).padStart(2, '0');
    const hours: string = String(now.getHours()).padStart(2, '0');
    const minutes: string = String(now.getMinutes()).padStart(2, '0');
    const seconds: string = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

//

const runCommand = (cmd: Array<string>): void => {
    if (cmd.length === 0)
        return;
    const {spawn} = Global.requireNodeModule<typeof ChildProcess>('child_process');
    spawn('cmd.exe', ['/c', 'start cmd.exe', '/k', ...cmd], {stdio: 'inherit', shell: true})
}

// 是否URL
const IsURL = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

const StartBrowser = (url: string): void => {
    exec(`start ${url}`);
}

export {ToString};
export {IsArray};
export {IsString};
export {Stringify};
export {IsObject};
export {CMD_Exists};
export {Exec_CMD};
export {ResolvePath};
export {SpliceArray};
export {ResolveSize};
export {FormatSec};
export {openOutputPath};
export {playBeep};
export {getCurrentDateTime};
export {runCommand};
export {IsURL};
export {StartBrowser};
