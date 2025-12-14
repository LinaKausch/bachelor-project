import { Input } from "./Input.js";

export const Serial = {
    port: null,
    reader: null,

    start: async () => {
        try {

            Serial.port = await navigator.serial.requestPort();

            await Serial.port.open({ baudRate: 9600 });
            console.log("Serial port opened!");

        } catch (err) {
            console.error("Failed to open serial port:", err);
            return;
        }

        const decoder = new TextDecoderStream();
        Serial.port.readable.pipeTo(decoder.writable);
        Serial.reader = decoder.readable.getReader();

        console.log("Connected! Waiting for serial data…");

        let buffer = "";

        while (true) {
            const { value, done } = await Serial.reader.read();
            if (done) break;
            if (!value) continue;

            buffer += value;

      
            let lines = buffer.split("\n");
            buffer = lines.pop(); 

            for (let line of lines) {
                line = line.trim();

                if (line.length === 0) continue;


                line = line.replace(/\r/g, "").replace(/\0/g, "");

                if (line[0] !== "{" || line[line.length - 1] !== "}") {
                    console.warn("Skipping incomplete line:", line);
                    continue;
                }

                try {
                    const data = JSON.parse(line);
    
                    Input.joy1 = data.p1;
                    Input.joy2 = data.p2;
                    Input.btn1 = data.btn1;
                    Input.btn2 = data.btn2;
                    Input.accX = data.accX;
                    Input.accY = data.accY;
                    Input.z = data.z;

                } catch (e) {
                    console.warn("JSON parse error:", line);
                }
            }
        }
    }
};
