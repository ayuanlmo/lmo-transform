const __G = global || window || this;
console.log(__G)
const __UNDEF = void 1;

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

export const Exec_CMD = (cmd: string, opt: any): Promise<any> => {
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

export const ResolvePath = (path: string) => {
    return path.split('\\').join('/')
}
