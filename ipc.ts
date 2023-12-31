import {
    app,
    BrowserWindow,
    dialog,
    globalShortcut,
    ipcMain,
    MessageBoxOptions,
    Notification,
    powerSaveBlocker
} from "electron";
import {join} from "path";

export const electronApi = 'electronApi';
let pasId: number | null = null;

export interface CreateNotification {
    title: string;
    body: string;
}

const createNotification = (params: CreateNotification) => {
    if (Notification.isSupported()) {
        new Notification({
            title: params.title,
            body: params.body,
            timeoutType: 'default',
            icon: './public/icon.png'
        }).show();
    }
}

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
    ipcMain.on('TO-TOP', (event: Electron.IpcMainEvent, {data}): void => {
        window.setAlwaysOnTop(data as boolean);
    });
    ipcMain.on('SHOW-ERROR-MESSAGE-BOX', (event: any, data: { msg: string; }): void => {
        createMessageBox(window, {message: data.msg, type: 'error', title: '糟糕！出错啦'});
    });
    ipcMain.on('CREATE-NOTIFICATION', (event: any, data: CreateNotification): void => {
        createNotification(data);
    });
    ipcMain.on('SHOW-INFO-MESSAGE-BOX', (event: any, data: string): void => {
        createMessageBox(window, {message: data, type: 'info', icon: join("./public/favicon.ico")});
    });
    ipcMain.on('SHOW-WARNING-MESSAGE-BOX', (event: any, data: string): void => {
        createMessageBox(window, {message: data, type: 'warning'});
    });
    ipcMain.on('OPEN-PAS', (event: Electron.IpcMainEvent, open: boolean): void => {
        if (open) {
            if (!pasId)
                pasId = powerSaveBlocker.start('prevent-app-suspension');
            if (powerSaveBlocker.isStarted(pasId))
                event.sender.send('PAS-ON');
        } else {
            if (pasId && powerSaveBlocker.isStarted(pasId))
                event.sender.send('PAS-OFF');
        }
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

    if (exit) {
        app.exit();
    } else if (instant) {
        app.quit();
    } else {
        const shouldExit: boolean = await showCloseAppConfirmationDialog();
        globalShortcut.unregisterAll();
        if (pasId !== null)
            powerSaveBlocker.stop(pasId as number);

        if (shouldExit && process.platform !== 'darwin')
            app.quit();
    }
}
