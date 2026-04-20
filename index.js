const fs = require("fs");
const { exec } = require("child_process");

app.post("/compile", (req, res) => {

    const code = req.body.code;

    // 1. اكتب الملف
    fs.writeFileSync("sketch/sketch.ino", code);

    // 2. compile
    exec("arduino-cli compile --fqbn arduino:avr:uno sketch", (err, stdout, stderr) => {

        if (err) {
            return res.json({
                success: false,
                error: stderr
            });
        }

        // 3. قراءة ملف HEX
        const hexPath = "sketch/build/arduino.avr.uno/sketch.ino.hex";

        try {
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
    });
});
