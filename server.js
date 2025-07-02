import express from "express";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import auth from "./authMiddleware.js";
import adminRoutes from "./admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(auth);
app.use("/admin", adminRoutes);

const LANG_CONFIG = {
  python: {
    ext: "py",
    cmd: (file) => `python3 ${file}`,
  },
  node: {
    ext: "js",
    cmd: (file) => `node ${file}`,
  },
  cpp: {
    ext: "cpp",
    cmd: (file) => `g++ ${file} -o output && ./output`,
  },
  java: {
    ext: "java",
    cmd: (file) => {
      const className = path.basename(file, ".java");
      return `javac ${file} && java -cp . ${className}`;
    },
  },
};

app.post("/run", async (req, res) => {
  const { code, language } = req.body;
  const config = LANG_CONFIG[language];
  if (!config) return res.status(400).json({ error: "Unsupported language" });

  const filename = `code-${Date.now()}.${config.ext}`;
  const filepath = path.join(__dirname, filename);

  fs.writeFileSync(filepath, code);

  exec(config.cmd(filename), { cwd: __dirname }, (err, stdout, stderr) => {
    fs.unlinkSync(filepath);

    if (language === "cpp") {
      try { fs.unlinkSync(path.join(__dirname, "output")); } catch {}
    }

    if (language === "java") {
      const className = path.basename(filename, ".java");
      try { fs.unlinkSync(`${__dirname}/${className}.class`); } catch {}
    }

    if (err) return res.json({ error: stderr || err.message });
    res.json({ output: stdout });
  });
});

app.get("/", (_, res) => {
  res.send("✅ Code Executor API is running.");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Code Executor API running");
});
