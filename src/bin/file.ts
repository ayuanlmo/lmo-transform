import {NoSuchFileDirectory} from "../const/Message";

export namespace File {
    const {ipcRenderer} = window.require('electron');
    const {existsSync} = window.require('fs');
    const {extname} = window.require('path');

    export const ImageFileTypes = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];

    export const directoryIs = (path: string | null) => {
        if (path === null) return false;
        const _: boolean = existsSync(path);

        if (!_)
            ipcRenderer.send('SHOW-INFO-MESSAGE-BOX', NoSuchFileDirectory(path));

        return _;
    }

    export const isImageFile = (path: string): boolean => {
        return ImageFileTypes.includes(extname(path).toLowerCase());
    }
}
