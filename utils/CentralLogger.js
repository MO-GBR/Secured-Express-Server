import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logDir = path.join(__dirname, "../logs");

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const writeLog = (level, message, meta = {}) => {
    const log = {
        level,
        message,
        ...meta,
        timestamp: new Date().toISOString(),
    };
    
    const logLine = JSON.stringify(log) + "\n";
    
    // Console
    console[level === "error" ? "error" : "log"](logLine);
    
    // File
    const fileName = level.split(" ")[0];
    fs.appendFileSync(
        path.join(logDir, `${fileName}.log`),
        logLine
    );
};

export const logInfo = (msg, meta) => writeLog("info 🟢 ", msg, meta);
export const logWarn = (msg, meta) => writeLog("warn 🟡 ", msg, meta);
export const logError = (msg, meta) => writeLog("error 🔴 ", msg, meta);