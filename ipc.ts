import {app, BrowserWindow, dialog, globalShortcut, ipcMain, MessageBoxOptions} from "electron";
import {join} from "path";

export const electronApi = 'electronApi';

const createMessageBox = (win: BrowserWindow, opt: {
    type: "warning" | "none" | "info" | "error" | "question",
    icon?: string;
    title?: string;
    message: string;
}) => {
    const {type, icon = '', message, title = '提示信息'} = opt;
    dialog.showMessageBoxSync(win, {
        type: type,
        title: title,
        icon: icon,
        defaultId: 0,
        message: message,
        buttons: ['确定']
    });
}

export const initIpcMainHandles = (window: BrowserWindow): void => {
    ipcMain.on('HIDE-WINDOW', (): void => window.minimize());
    ipcMain.on('MAX-WINDOW', (): void => window.maximize());
    ipcMain.on('RESTORE-WINDOW', (): void => window.unmaximize());
    ipcMain.on('CLOSE-WINDOW', async (): Promise<void> => await closeApp());
    ipcMain.on("OPEN-DIRECTORY", (event: Electron.IpcMainEvent): void => {
        dialog.showOpenDialog(
            window,
            {properties: ['openDirectory']}
        ).then((v: Electron.OpenDialogReturnValue) => {
            if (!(v.canceled))
                event.sender.send('SELECTED-DIRECTORY', v.filePaths[0]);
        });
    });
    ipcMain.on('SHOW-ERROR-MESSAGE-BOX', (event: any, data: { msg: string; }): void => {
        createMessageBox(window, {message: data.msg, type: 'error', title: '糟糕！出错啦'});
    });
    ipcMain.on('SHOW-INFO-MESSAGE-BOX', (event: any, data: string): void => {
        createMessageBox(window, {message: data, type: 'info', icon: join("./public/favicon.ico")});
    });
    ipcMain.on('SHOW-WARNING-MESSAGE-BOX', (event: any, data: string): void => {
        createMessageBox(window, {message: data, type: 'warning'});
    });
};

const showCloseAppConfirmationDialog = async () => {
    const options = {
        type: 'warning',
        title: '系统提示',
        message: '您确定要退出吗？',
        buttons: ['OK', 'Cancel']
    };

    const {response} = await dialog.showMessageBox(options as MessageBoxOptions);
    return response === 0;
};

export const closeApp = async (instant: boolean = false, exit: boolean = false): Promise<void> => {
    globalShortcut.unregisterAll();

    if (exit) {
        app.exit();
    } else if (instant) {
        app.quit();
    } else {
        const shouldExit: boolean = await showCloseAppConfirmationDialog();

        if (shouldExit && process.platform !== 'darwin')
            app.quit();
    }
}
