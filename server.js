const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const auth = require("./authMiddleware");
const adminRoutes = require("./admin");

const app = express();
app.use(express.json());
app.use(auth); // API Key middleware
app.use("/admin", adminRoutes);

const LANG_CONFIG = {
  python: { ext: "py", image: "python-runner" },
  cpp: { ext: "cpp", image: "cpp-runner" },
  java: { ext: "java", image: "java-runner" },
  node: { ext: "js", image: "nodejs-runner" },
};

app.post("/run", (req, res) => {
  const { code, language } = req.body;
  const config = LANG_CONFIG[language];
  if (!config) return res.status(400).json({ error: "Language not supported" });

  const fileName = `code-${Date.now()}.${config.ext}`;
  const filePath = path.join(__dirname, fileName);
  fs.writeFileSync(filePath, code);

  const dockerCommand = `docker run --rm -v ${filePath}:/app/user_code.${config.ext} --network none -m 128m --cpus="0.5" ${config.image}`;

  exec(dockerCommand, (err, stdout, stderr) => {
    fs.unlinkSync(filePath);
    if (err) return res.json({ error: stderr || err.message });
    res.json({ output: stdout });
  });
});

app.listen(3000, () => console.log("Code Executor API running on port 3000"));
