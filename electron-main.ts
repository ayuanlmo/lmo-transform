import {app, BrowserWindow, Menu} from 'electron';
import {join} from 'path';
import {closeApp, initIpcMainHandles} from './ipc';

type APP_RUN_TYPES = 'dev' | 'prod';
export const main = (): void => {
    onReady('dev');
    appListens();
}


const onReady = (type: APP_RUN_TYPES): void => {
    const os = require('os');

    if ((os.platform() !== 'win32') && (os.arch() !== 'x64'))
        return closeApp(true);

    app.whenReady().then(async (): Promise<void> => {
        const mainWindow = createWindow(type);
        mainWindowListens(await mainWindow);
    });
}

const mainWindowListens = (mainWindow: BrowserWindow): void => {
    initIpcMainHandles(mainWindow);
}

const createWindow = async (type: APP_RUN_TYPES = 'dev'): Promise<BrowserWindow> => {
    const window = new BrowserWindow({
        width: 1500,
        height: 800,
        minWidth: 1500,
        minHeight: 800,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    window.on('close', () => {
        return closeApp();
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
        return closeApp();
    });
    app.on('activate', async (): Promise<void> => {
        if (require('os').platform() === '')
            if (BrowserWindow.getAllWindows().length === 0)
                await createWindow();
    });
    console.log()
}

((): void => {
    Menu.setApplicationMenu(null);
})();
