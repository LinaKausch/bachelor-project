import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'

let port

export const connectArduino = (mainWindow) => {
    SerialPort.list().then(ports => {
        const arduino = ports.find(p =>
            p.manufacturer?.toLowerCase().includes('arduino')
        )

        if (!arduino) {
            console.log('Arduino not found')
            return
        }

        port = new SerialPort({
            path: arduino.path,
            baudRate: 9600
        })

        const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))

        parser.on('data', data => {
            mainWindow.webContents.send('arduino-data', data.trim())
        })

        console.log('Arduino connected')
    })
}
