interface MyFileList extends FileList, File {
    path: any;
}

export const SelectFile = () => {
    return new Promise((resolve, reject): void => {
        const i: HTMLInputElement = document.createElement('input');
        i.type = 'file';
        i.multiple = true;
        i.accept = 'video/*';
        i.onchange = () => {
            const files = i.files as any;
            const _ = [];

            for (let j = 0; j < files.length; j++) {
                if (files[j].type !== '')
                    _.push({
                        name: files[j].name,
                        path: files[j].path.split('\\').join('/'),
                        type: files[j].type,
                        lastModified: files[j].lastModified,
                    });
            }
            resolve(_);
        }
        i.click();
    });
}