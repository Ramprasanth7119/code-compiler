import express from "express";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import auth from "./authMiddleware.js";
import adminRoutes from "./admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors({origin: "*"}));
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
    cmd: (className) => `javac ${className}.java && java -cp . ${className}`,
  },
};

app.post("/run", async (req, res) => {
  let { code, language } = req.body;
  const config = LANG_CONFIG[language];
  if (!config) return res.status(400).json({ error: "Unsupported language" });

  let filename = `code-${Date.now()}.${config.ext}`;
  let filepath = path.join("/tmp", filename);

  // Handle Java filename/class
  let javaClassName = null;
  if (language === "java") {
    javaClassName = `Code${Date.now()}`;
    code = code.replace(/public\s+class\s+\w+/, `public class ${javaClassName}`);
    filename = `${javaClassName}.java`;
    filepath = path.join("/tmp", filename);
  }

  fs.writeFileSync(filepath, code);

  const execCmd = language === "java"
    ? config.cmd(javaClassName)
    : config.cmd(filepath);

  exec(execCmd, { cwd: "/tmp" }, (err, stdout, stderr) => {
    try { fs.unlinkSync(filepath); } catch {}

    if (language === "cpp") {
      try { fs.unlinkSync("/tmp/output"); } catch {}
    }

    if (language === "java") {
      try { fs.unlinkSync(`/tmp/${javaClassName}.class`); } catch {}
    }

    if (err) return res.json({ error: stderr || err.message });
    res.json({ output: stdout });
  });
});

app.get("/", (_, res) => {
  res.send("✅ Code Executor API is live.");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Code Executor API running");
});
