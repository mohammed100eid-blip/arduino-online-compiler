const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

const app = express();
app.use(bodyParser.json());

let CLI_READY = false;

// 1️⃣ تثبيت Arduino CLI أول مرة
function setupArduino() {
    if (CLI_READY) return;

    console.log("Installing Arduino CLI...");

    exec(`
        mkdir -p arduino &&
        cd arduino &&
        curl -L https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_Linux_64bit.tar.gz -o cli.tar.gz &&
        tar -xvf cli.tar.gz &&
        chmod +x arduino-cli &&
        ./arduino-cli core update-index &&
        ./arduino-cli core install arduino:avr
    `, (err, out, errout) => {

        if (err) {
            console.log("CLI install error:", errout);
            return;
        }

        CLI_READY = true;
        console.log("Arduino CLI Ready ✔");
    });
}

// 2️⃣ تشغيل السيرفر
app.get("/", (req, res) => {
    setupArduino();
    res.json({ status: "running" });
});

// 3️⃣ compile endpoint
app.post("/compile", (req, res) => {

    setupArduino();

    const code = req.body.code;

    if (!code) {
        return res.json({ success: false, error: "no code" });
    }

    if (!fs.existsSync("sketch")) {
        fs.mkdirSync("sketch");
    }

    fs.writeFileSync("sketch/sketch.ino", code);

    exec("./arduino/arduino-cli compile --fqbn arduino:avr:uno sketch", (err, stdout, stderr) => {

        if (err) {
            return res.json({
                success: false,
                error: stderr
            });
        }

        try {
            const hex = fs.readFileSync(
                "sketch/build/arduino.avr.uno/sketch.ino.hex",
                "utf8"
            );

            res.json({
                success: true,
                hex: hex
            });

        } catch (e) {
            res.json({
                success: false,
                error: "HEX not found"
            });
        }
    });
});

// 4️⃣ تشغيل السيرفر
app.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
    setupArduino();
});
