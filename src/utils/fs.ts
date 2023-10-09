import {getFileInfo, GetFileInfoTypes, getVideoFirstFrame} from "../bin/ff";
import {ResolvePath} from "./index";
import AppConfig from "../conf/AppConfig";
import store from '../lib/Store/index'
import {setGlobalLoading} from "../lib/Store/AppState";
import {FILE_ERROR_MESSAGE} from "../const/Message";
import {File} from "../bin/file";
import * as Root from "../Root";

const {ipcRenderer} = window.require('electron');
const fs = window.require('fs');

interface ResolveFileTypes extends GetFileInfoTypes {
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
const SelectFile = (): Promise<Array<ResolveFileTypes>> => {
    return new Promise((resolve, reject): void => {
        const i: any = document.createElement('input');
        i.type = 'file';
        i.multiple = true;
        i.accept = 'video/*';
        i.onchange = async () => {
            resolve(resolveFile(i.files));
        }
        i.click();
    });
}

const resolveFile = async (files: Array<Root.File>): Promise<any[]> => {
    store.dispatch(setGlobalLoading(true));
    const _: any[] | PromiseLike<any[]> = [];

    for (let j = 0; j < files.length; j++) {
        const filePath: string = files[j].path.split('\\').join('/');

        await getFileInfo(filePath).then(async (fileInfo: GetFileInfoTypes) => {
            const isVideo: boolean = fileInfo?.streams?.codec_type === 'video';

            try {
                if (files[j].type !== '')
                    _.push({
                        name: files[j].name,
                        path: ResolvePath(files[j].path),
                        type: files[j].type,
                        cover: File.isImageFile(filePath) ? filePath : isVideo ? await getVideoFirstFrame(filePath) : '',
                        lastModified: files[j].lastModified,
                        ...fileInfo,
                        output: {
                            type: '',
                            libs: ''
                        }
                    });
            } catch (e: any) {
                store.dispatch(setGlobalLoading(false));
            }
        }).catch((e: any): void => {
            ipcRenderer.send('SHOW-ERROR-MESSAGE-BOX', {
                msg: FILE_ERROR_MESSAGE(filePath, e.toString())
            });
        })
    }
    store.dispatch(setGlobalLoading(false));
    return _;
}

const GetTmpFileInfo = (): { total: number; size: number; } => {
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

const DeleteTmpFile = (file: string = '') => {
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

export {ResolveFileTypes}
export {SelectFile}
export {resolveFile}
export {GetTmpFileInfo}
export {DeleteTmpFile}
