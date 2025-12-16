import { app, BrowserWindow } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let mainWindow
let port

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        fullscreen: true,
        frame: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true
        }
    })

    if (isDev) {
        mainWindow.loadURL('http://localhost:8080');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    connectArduino()
}

const connectArduino = async () => {
    const ports = await SerialPort.list()

    const arduino = ports.find(p =>
        p.manufacturer?.toLowerCase().includes('arduino')
    )

    if (!arduino) {
        setTimeout(connectArduino, 2000)
        return
    }

    port = new SerialPort({
        path: arduino.path,
        baudRate: 9600
    })

    const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))

    parser.on('data', (data) => {
        mainWindow.webContents.send('arduino-data', data.trim())
    })

    port.on('close', () => {
        console.log('Arduino disconnected')
        setTimeout(connectArduino, 2000)
    })

    console.log('Arduino connected')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
