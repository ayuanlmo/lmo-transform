"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const ipc_1 = require("./ipc");
const api = {
    openDialog: () => electron_1.ipcRenderer.invoke(ipc_1.ElectronChannel.openDialog),
    startDrag: async (fileName) => await electron_1.ipcRenderer.invoke(ipc_1.ElectronChannel.onDragStart, fileName)
};
electron_1.contextBridge.exposeInMainWorld(ipc_1.electronApi, api);
//# sourceMappingURL=preload.js.map