const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('arduino', {
    onData: (callback) => {
        ipcRenderer.on('arduino-data', (_, data) => callback(data));
    }
});

console.log('PRELOAD LOADED');
