import { Input } from "./Input.js";

export const Serial = {
    port: null,
    reader: null,

    start: async () => {
        Serial.port = await navigator.serial.requestPort();
        await Serial.port.open({ baudRate: 9600 });

        const decoder = new TextDecoderStream();
        Serial.port.readable.pipeTo(decoder.writable);
        Serial.reader = decoder.readable.getReader();

        console.log("Connected! Waiting for data...");

        let buffer = "";

        while (true) {
            const { value, done } = await Serial.reader.read();
            if (done) break;

            buffer += value;
            const lines = buffer.split("\n");
            buffer = lines.pop();

            for (let line of lines) {
                line = line.trim();
                if (!line.startsWith("{")) continue;

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
                    console.warn("Bad JSON:", line);
                }
               
            }
        }
    }
};
