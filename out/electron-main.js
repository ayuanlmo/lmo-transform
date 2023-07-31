"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const electron_1 = require("electron");
const path_1 = require("path");
const ipc_1 = require("./ipc");
const main = () => {
    onReady('dev');
    appListens();
};
exports.main = main;
const onReady = (type) => {
    electron_1.app.whenReady().then(async () => {
        const mainWindow = createWindow(type);
        mainWindowListens(await mainWindow);
    });
};
const mainWindowListens = (mainWindow) => {
    ipcMainHandles(mainWindow);
};
const ipcMainHandles = (mainWindow) => {
    electron_1.ipcMain.handle(ipc_1.ElectronChannel.openDialog, () => {
        electron_1.dialog.showOpenDialog(mainWindow).then(v => {
            console.log(v);
        });
    });
};
const createWindow = async (type = 'dev') => {
    const window = new electron_1.BrowserWindow({
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
    }
    else
        await window.loadFile((0, path_1.join)(__dirname, 'build', 'index.html'));
    return window;
};
const appListens = () => {
    electron_1.app.on('window-all-closed', () => {
        if (process.platform !== 'darwin')
            electron_1.app.quit();
    });
    electron_1.app.on('activate', async () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            await createWindow();
    });
};
//# sourceMappingURL=electron-main.js.map