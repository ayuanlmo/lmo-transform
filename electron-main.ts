import {app, BrowserWindow, globalShortcut, Menu} from 'electron';
import {join} from 'path';
import {closeApp, initIpcMainHandles} from './ipc';
import AppConfig from "./src/conf/AppConfig";
import * as process from "process";

type APP_RUN_TYPES = 'dev' | 'prod';

const os = require('os');
const fs = require('fs');
const ShortcutKey = [
    {
        key: 'Ctrl+Alt+Shift+F12',
        description: 'Open dev tools',
        handlers: (main?: BrowserWindow): void => main?.webContents.openDevTools()
    }
];
const isDev: boolean = process.env.NODE_ENV?.trim() === 'development';

export const main = (): void => {
    app.on('ready', async (): Promise<void> => {
        await onReady(isDev ? 'dev' : 'prod');
        appListens();
    });
}

const onReady = async (type: APP_RUN_TYPES): Promise<void> => {
    const {tempPath} = AppConfig.system;
    const appPath: string = `${AppConfig.system.tempPath}${AppConfig.appName}`;
    const appTmpPath: string = `${AppConfig.system.tempPath}${AppConfig.appName}/tmp`;

    if (!fs.existsSync(appPath))
        fs.mkdirSync(appPath);
    if (!fs.existsSync(appTmpPath))
        fs.mkdirSync(appTmpPath);

    if ((os.platform() !== 'win32') && (os.arch() !== 'x64'))
        await closeApp(true);

    app.whenReady().then(async (): Promise<void> => {
        const mainWindow: BrowserWindow = await createWindow(type);
        mainWindowListens(mainWindow);

        ShortcutKey.forEach((i) => {
            globalShortcut.register(i.key, (): void => {
                i.handlers(mainWindow);
            });
            if (!globalShortcut.isRegistered(i.key))
                console.log(`${i.key} 注册失败`);
        });
    });
}

const mainWindowListens = (mainWindow: BrowserWindow): void => {
    initIpcMainHandles(mainWindow);
}

const createWindow = async (type: APP_RUN_TYPES = 'dev'): Promise<BrowserWindow> => {
    const window = new BrowserWindow({
        width: 1500,
        height: 800,
        icon: 'public/favicon.ico',
        minWidth: 1500,
        minHeight: 800,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            contextIsolation: false,
        }
    });

    window.on('close', (event: Electron.Event): void => {
        event.preventDefault();
        closeApp();
    });
    window.on('maximize', (): void => window.webContents.send('WINDOW-ON-MAX', true));
    window.on('unmaximize', (): void => window.webContents.send('WINDOW-ON-MAX', false));

    if (type === 'dev') {
        await window.loadURL('http://localhost:3000');
        window.webContents.openDevTools();
    } else
        await window.loadFile(join(__dirname, '/index.html'))
    return window;
}

const appListens = (): void => {
    app.on('before-quit', async (event: Electron.Event): Promise<void> => {
        event.preventDefault();
        await closeApp(true, true);
    });
    app.on('activate', async (): Promise<void> => {
        if (require('os').platform() === "win32") {
            if (BrowserWindow.getAllWindows().length === 0)
                await createWindow();
        } else {
            await closeApp(true);
        }
    });
}

((): void => {
    Menu.setApplicationMenu(null);
})();
