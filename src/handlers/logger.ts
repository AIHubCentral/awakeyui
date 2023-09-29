const beautify = require('beautify.log').default;

function formatText({text}: { text: any }) {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear().toString();
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');
    const formattedDate = `${day}.${month}.${year} ${hour}:${minute}:${second}`;

    return text.replace('TIMESTAMP', formattedDate);
}

function createLogFile() {
    // create latest.log file
    // if it exists, rename it to the current date and time and create a new latest.log file
    const fs = require('fs');
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear().toString();
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');
    const formattedDate = `${year}${month}${day}.${hour}${minute}${second}`;

    if (fs.existsSync('./logs/latest.log')) {
        fs.renameSync('./logs/latest.log', `./logs/${formattedDate}.log`);
    }
    fs.writeFileSync('./logs/latest.log', '');
    fs.writeFileSync('./logs/debug.log', '');
}

function dumpLog(message: any) {
    // add message to the last line of latest.log
    const fs = require('fs');
    const data = fs.readFileSync('./logs/latest.log', 'utf8');
    const lines = data.split('\n');
    lines[lines.length - 1] += message + "\n";
    const text = lines.join('\n');
    fs.writeFileSync('./logs/latest.log', text);
}

function dumpDebugLog(message: any) {
    // add message to the last line of latest.log
    const fs = require('fs');
    const data = fs.readFileSync('./logs/debug.log', 'utf8');
    const lines = data.split('\n');
    lines[lines.length - 1] += message + "\n";
    const text = lines.join('\n');
    fs.writeFileSync('./logs/debug.log', text);
}

createLogFile();
module.exports = {

    startup({text}: { text: any }) {
        const prefix = '{fgCyan}[STARTUP] {reset}';
        const formattedText = formatText({text: `[TIMESTAMP] ` + prefix + text});
        beautify.log(formattedText);
        dumpLog(formattedText);
    },

    info({text}: { text: any }) {
        const prefix = '{fgGreen}[INFO] {reset}';
        const formattedText = formatText({text: `[TIMESTAMP] ` + prefix + text});
        beautify.log(formattedText);
        dumpLog(formattedText);
    },

    db({text}: { text: any }) {
        const prefix = '{fgGreen}{bright}[DATABASE] {reset}';
        const formattedText = formatText({text: `[TIMESTAMP] ` + prefix + text});
        beautify.log(formattedText);
        dumpLog(formattedText);
    },

    debug({text}: { text: any }) {
        if (process.env.DEV === 'true') {
            const prefix = '{fgBlack}[DEBUG] {reset}';
            const formattedText = formatText({text: `[TIMESTAMP] ` + prefix});
            beautify.log(formattedText);
            console.log(text);
        }
        // check if text is an object
        /*if (typeof text === 'object') {
            text = JSON.stringify(text, null, 2);
        } else {
            text = text.toString();
        }
        dumpDebugLog(text)*/
    },

    cmsg({text}: { text: any }) {
        const prefix = '{fgBlue}[MODULE] {reset}{fgMagenta}';
        const formattedText = formatText({text: `[TIMESTAMP] ` + prefix + text});
        beautify.log(formattedText);
        dumpLog(formattedText);
    },

    warn({text}: { text: any }) {
        const prefix = '{fgYellow}[WARN] {reset}';
        const formattedText = formatText({text: `[TIMESTAMP] ` + prefix + text});
        beautify.log(formattedText);
        dumpLog(formattedText);
    },

    error({text}: { text: any }) {
        const prefix = '{fgRed}[ERROR] {reset}';
        const formattedText = formatText({text: `[TIMESTAMP] ` + prefix});
        beautify.log(formattedText);
        console.log(text);
        dumpLog(formattedText);
        dumpLog(text)
    },

    fatalError({err, origin, value}: { err: any, origin: any, value: any }) {
        if (value !== undefined) {
            const prefix = '{fgRed}{bright}[FATAL ERROR] {bright}';
            const formattedText = formatText({text: `[TIMESTAMP] ` + `${prefix}\n${err}\n${origin}\n${value}`});
            beautify.log(formattedText);
            dumpLog(formattedText);
        }
    },
};
