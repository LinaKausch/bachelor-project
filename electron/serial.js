import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'

let port

const connectArduino = () => {
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
            // send data to renderer (Phaser)
            mainWindow.webContents.send('arduino-data', data.trim())
        })

        console.log('Arduino connected')
    })
}
