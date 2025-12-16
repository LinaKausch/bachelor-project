import { SerialWeb } from "./SerialWeb.js";
import { SerialElectron } from "./SerialElectron.js";

export const Serial = {
    start() {
        if (window.arduino) {
            console.log("Serial via Electron");
            SerialElectron.start();
            return;
        }

        if ("serial" in navigator) {
            console.log("Serial via Browser");
            SerialWeb.start();
            return;
        }

        console.warn("No serial support available");
    }
};
