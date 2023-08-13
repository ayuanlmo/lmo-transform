import {getFileInfo, GetFileInfoTypes, getVideoFirstFrame} from "../bin/ff";
import {ResolvePath} from "./index";
import {FILE_ERROR_MESSAGE} from "../const/Message";

const {ipcRenderer} = window.require('electron');

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
                        type: ''
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
