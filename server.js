const express = require("express");
const { exec } = require("child_process");
const auth = require("./authMiddleware");
const adminRoutes = require("./admin");

const app = express();
app.use(express.json());
app.use(auth); // API Key middleware
app.use("/admin", adminRoutes);

// Map of language config
const LANG_CONFIG = {
  python: { ext: "py", image: "python-runner" },
  cpp: { ext: "cpp", image: "cpp-runner" },
  java: { ext: "java", image: "java-runner" },
  node: { ext: "js", image: "nodejs-runner" },
};

// Run code
app.post("/run", (req, res) => {
  const { code, language } = req.body;
  const config = LANG_CONFIG[language];
  if (!config) return res.status(400).json({ error: "Language not supported" });

  // Escape double quotes to safely pass code in ENV
  const escapedCode = code.replace(/"/g, '\\"');

  // Pass code via env variable instead of mounting
  const dockerCommand = `docker run --rm -e CODE="${escapedCode}" --network none -m 128m --cpus="0.5" ${config.image}`;

  exec(dockerCommand, (err, stdout, stderr) => {
    if (err) return res.json({ error: stderr || err.message });
    res.json({ output: stdout });
  });
});

app.listen(3000, () => console.log("Code Executor API running on port 3000"));
