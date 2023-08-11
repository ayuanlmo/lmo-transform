import {app, BrowserWindow, dialog, ipcMain} from "electron";

export const electronApi = 'electronApi';

export const initIpcMainHandles = (window: BrowserWindow): void => {
    ipcMain.on('HIDE-WINDOW', (): void => window.minimize());
    ipcMain.on('MAX-WINDOW', (): void => window.maximize());
    ipcMain.on('RESTORE-WINDOW', (): void => window.unmaximize());
    ipcMain.on('CLOSE-WINDOW', (): void => closeApp());
    ipcMain.on("OPEN-DIRECTORY", (event: Electron.IpcMainEvent): void => {
        dialog.showOpenDialog(
            window,
            {properties: ['openDirectory']}
        ).then((v: Electron.OpenDialogReturnValue) => {
            if(!(v.canceled))
                event.sender.send('SELECTED-DIRECTORY', v.filePaths[0]);
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
