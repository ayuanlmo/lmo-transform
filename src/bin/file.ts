import {NoSuchFileDirectory} from "../const/Message";

export namespace File {
    const {ipcRenderer} = window.require('electron');
    const {existsSync} = window.require('fs');

    export const directoryIs = (path: string | null) => {
        if (path === null) return false;
        const _: boolean = existsSync(path);

        if (!_)
            ipcRenderer.send('SHOW-INFO-MESSAGE-BOX', NoSuchFileDirectory(path));

        return _;
    }
}
