import express from "express";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";

const router = express.Router();
const file = path.join(process.cwd(), "apiKeyStore.js");

router.post("/generate-key", (req, res) => {
  const newKey = uuid();
  const content = `export default ${JSON.stringify([...require(file).default, newKey], null, 2)};`;
  fs.writeFileSync(file, content);
  res.json({ apiKey: newKey });
});

export default router;
