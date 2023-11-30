import {NoSuchFileDirectory} from "../const/Message";
import * as Electron from 'electron';
import * as FS from 'fs';
import * as Path from 'path';
import * as ChildProcess from 'child_process';
import Global from "../lib/Global";

namespace File {
    const {ipcRenderer} = Global.requireNodeModule<typeof Electron>('electron');
    const {existsSync, chmodSync} = Global.requireNodeModule<typeof FS>('fs');
    const {extname} = Global.requireNodeModule<typeof Path>('path');
    const {exec} = Global.requireNodeModule<typeof ChildProcess>('child_process');

    export const ImageFileTypes: string[] = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];

    export const directoryIs = (path: string | null): boolean => {
        if (path === null) return false;
        const _: boolean = existsSync(path);

        if (!_)
            ipcRenderer.send('SHOW-INFO-MESSAGE-BOX', NoSuchFileDirectory(path));

        return _;
    }

    export const isImageFile = (path: string): boolean => ImageFileTypes.includes(extname(path).toLowerCase());

    export const hideFile = (filePath: string): Promise<void> => {
        return new Promise((resolve, reject): void => {
            exec(`attrib +h "${filePath}"`, (error: any): void => {
                if (error)
                    reject(error)
                else
                    resolve()
            });
        });
    }

    export const unHideFile = (filePath: string): Promise<void> => {
        return new Promise((resolve, reject): void => {
            exec(`attrib -h "${filePath}"`, (error: any): void => {
                if (error)
                    reject(error)
                else
                    resolve()
            });
        });
    }

    export const toReadOnlyFile = (filePath: string): void => chmodSync(filePath, '0444');

    export const removeReadOnlyFile = (filePath: string): void => chmodSync(filePath, '0666');
}

export {File};
