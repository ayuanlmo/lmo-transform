import {getFileInfo, GetFileInfoTypes, getVideoFirstFrame} from "../bin/ff";
import {ResolvePath} from "./index";
import {FILE_ERROR_MESSAGE} from "../const/Message";
import AppConfig from "../conf/AppConfig";

const {ipcRenderer} = window.require('electron');
const fs = window.require('fs');

export interface ResolveFileTypes extends GetFileInfoTypes {
    name: string;
    path: string;
    type: string;
    cover: string;
    lastModified: number;
    output: {
        type: string;
    }
}

/**
 * @method SelectFile
 * @returns {Promise<[{
 *     ResolveFileTypes
 * }]>}
 * **/
export const SelectFile = (): Promise<Array<ResolveFileTypes>> => {
    return new Promise((resolve, reject): void => {
        const i: any = document.createElement('input');
        i.type = 'file';
        i.multiple = true;
        i.accept = 'video/*';
        i.onchange = async () => resolve(resolveFile(i.files));
        i.click();
    });
}

export const resolveFile = async (files: Array<any>): Promise<any[]> => {
    const _ = [];

    for (let j = 0; j < files.length; j++) {
        const filePath: string = files[j].path.split('\\').join('/');

        try {
            const framePath = await getVideoFirstFrame(filePath);
            if (files[j].type !== '')
                _.push({
                    name: files[j].name,
                    path: ResolvePath(files[j].path),
                    type: files[j].type,
                    cover: framePath,
                    lastModified: files[j].lastModified,
                    ...await getFileInfo(filePath),
                    output: {
                        type: '',
                        libs: ''
                    }
                });
        } catch (e: any) {
            if (e.err)
                ipcRenderer.send('SHOW-ERROR-MESSAGE-BOX', {
                    msg: FILE_ERROR_MESSAGE(e.path, e.msg.toString())
                });
        }
    }
    return _;
}

export const GetTmpFileInfo = (): { total: number; size: number; } => {
    const path: string = AppConfig.system.tempPath + AppConfig.appName + '/tmp';
    const files: Array<string> = fs.readdirSync(path);
    let size: number = 0;

    files.forEach((i: string): void => {
        const file: { size: number } = fs.statSync(path + '/' + i);
        size += file.size;
    });

    return {
        total: files.length,
        size: Math.ceil(size / 1024)
    }
}

export const DeleteTmpFile = (file: string = '') => {
    const path: string = file === '' ? AppConfig.system.tempPath + AppConfig.appName + '/tmp' : file;
    const files: Array<string> = fs.readdirSync(path);

    if (fs.existsSync(path)) {
        files.forEach((i: string): void => {
            const _tmp: string = `${path}/${i}`;

            if (fs.statSync(_tmp).isDirectory())
                DeleteTmpFile(_tmp);
            else
                fs.unlinkSync(_tmp);
        });
        ipcRenderer.send('SHOW-INFO-MESSAGE-BOX', '删除完成');
    }
}
