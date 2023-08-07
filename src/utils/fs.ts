import {getFileInfo, getVideoFirstFrame} from "../bin/ff";
import {ResolvePath} from "./index";


interface MyFileList extends FileList, File {
    path: any;
}

export const SelectFile = () => {
    return new Promise((resolve, reject): void => {
        const i: HTMLInputElement = document.createElement('input');
        i.type = 'file';
        i.multiple = true;
        i.accept = 'video/*';
        i.onchange = async () => resolve(resolveFile(i.files));
        i.click();
    });
}

export const resolveFile = async (files) => {
    const _ = [];

    for (let j = 0; j < files.length; j++) {
        const filePath: string = files[j].path.split('\\').join('/');
        if (files[j].type !== '')
            _.push({
                name: files[j].name,
                path: ResolvePath(files[j].path),
                type: files[j].type,
                cover: await getVideoFirstFrame(filePath),
                lastModified: files[j].lastModified,
                ...await getFileInfo(filePath),
                output: {
                    type: ''
                }
            });
    }
    return _;
}
