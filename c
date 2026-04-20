const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Arduino Server on PHONE 🔥");
});

app.post("/compile", (req, res) => {
  const code = req.body.code;

  console.log("CODE:", code);

  res.json({
    success: true,
    hex: "DUMMY_HEX_FROM_PHONE"
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

