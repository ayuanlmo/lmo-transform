import {app, BrowserWindow, dialog, ipcMain} from 'electron';
import {join} from 'path';
import {ElectronChannel} from './ipc';

type APP_RUN_TYPES = 'dev' | 'prod';
export const main = (): void => {
    onReady('dev');
    appListens();
}


const onReady = (type: APP_RUN_TYPES): void => {
    app.whenReady().then(async (): Promise<void> => {
        const mainWindow = createWindow(type);
        mainWindowListens(await mainWindow);
    });
}

const mainWindowListens = (mainWindow: BrowserWindow): void => {
    ipcMainHandles(mainWindow);
}


const ipcMainHandles = (mainWindow: BrowserWindow): void => {
    ipcMain.handle(ElectronChannel.openDialog, (): void => {
        dialog.showOpenDialog(mainWindow).then(v => {
            console.log(v);
        });
    });
}

const createWindow = async (type: APP_RUN_TYPES = 'dev'): Promise<BrowserWindow> => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    if (type === 'dev') {
        await window.loadURL('http://localhost:3000');
        window.webContents.openDevTools();
    } else
        await window.loadFile(join(__dirname, 'build', 'index.html'));
    return window;
}

const appListens = () => {
    app.on('window-all-closed', (): void => {
        if (process.platform !== 'darwin')
            app.quit();
    });
    app.on('activate', async (): Promise<void> => {
        if (BrowserWindow.getAllWindows().length === 0)
            await createWindow();
    });
}
