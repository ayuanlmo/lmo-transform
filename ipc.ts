import {app, BrowserWindow, dialog, ipcMain} from "electron";

export const electronApi = 'electronApi';

export enum ElectronChannel {
    openDialog = 'OPEN-DIALOG',
    onDragStart = 'ON-DRAG-START',
}

export const initIpcMainHandles = (window: BrowserWindow): void => {
    ipcMain.on('HIDE-WINDOW', (): void => window.minimize());
    ipcMain.on('MAX-WINDOW', (): void => window.maximize());
    ipcMain.on('RESTORE-WINDOW', (): void => window.unmaximize());
    ipcMain.on('CLOSE-WINDOW', (): void => {
        closeApp();
    });
    ipcMain.on(ElectronChannel.openDialog, (): void => {
        dialog.showOpenDialog(window).then(v => {
            console.log(v);
        });
    });
};

export const closeApp = (_: boolean = false): void => {
    if (_) return app.quit();

    dialog.showMessageBox({
        type: 'warning',
        title: "系统提示",
        message: "您确定要退出吗？",
        buttons: ["OK", "Cancel"]
    }).then((res): void => {
        if (res.response === 0)
            if (process.platform !== 'darwin')
                app.quit();
    });
}
