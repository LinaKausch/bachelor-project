import { Input } from "./Input.js";

export const SerialElectron = {
    start() {
        if (!window.arduino) {
            console.warn("Electron Arduino bridge not found");
            return;
        }

        window.arduino.onData((line) => {
            // console.log('📩 ELECTRON → RENDERER RAW:', line);
            if (!line) return;

            line = line.replace(/\r/g, "").replace(/\0/g, "");

            if (line[0] !== "{" || line[line.length - 1] !== "}") {
                console.warn('Skipping non-JSON line:', line);
                return;
            }

            line = line.trim();

            try {
                const data = JSON.parse(line);

                Input.joy1 = data.p1;
                Input.joy2 = data.p2;
                Input.btn1 = data.btn1;
                Input.btn2 = data.btn2;
                Input.accX = data.accX;
                Input.accY = data.accY;
                Input.z = data.z;

                // console.log('🎮 INPUT UPDATED', Input);


            } catch (e) {
                console.warn('Bad JSON:', line);
            }

        });

        console.log("Electron serial active");
    }
};
