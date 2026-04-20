const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

const app = express();

app.use(bodyParser.json());

// health check
app.get("/", (req, res) => {
    res.json({ status: "Arduino Compiler Running" });
});

app.post("/compile", (req, res) => {

    const code = req.body.code;

    if (!code) {
        return res.json({
            success: false,
            error: "No code provided"
        });
    }

    // 1. إنشاء مجلد مؤقت
    if (!fs.existsSync("sketch")) {
        fs.mkdirSync("sketch");
    }

    // 2. كتابة الكود داخل ملف ino
    fs.writeFileSync("sketch/sketch.ino", code);

    // 3. compile باستخدام Arduino CLI
    exec(
        "arduino-cli compile --fqbn arduino:avr:uno sketch",
        (err, stdout, stderr) => {

            if (err) {
                return res.json({
                    success: false,
                    error: stderr || err.message
                });
            }

            try {
                // 4. قراءة ملف HEX الناتج
                const hexPath = "sketch/build/arduino.avr.uno/sketch.ino.hex";

                const hex = fs.readFileSync(hexPath, "utf8");

                res.json({
                    success: true,
                    hex: hex
                });

            } catch (e) {
                res.json({
                    success: false,
                    error: "HEX file not found"
                });
            }
        }
    );
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
