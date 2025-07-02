import express from "express";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import apiKeys from "./apiKeyStore.js";

const router = express.Router();
const file = path.join(process.cwd(), "apiKeyStore.js");

router.post("/generate-key", (req, res) => {
  const newKey = uuid();
  const updatedKeys = [...apiKeys, newKey];
  const content = `export default ${JSON.stringify(updatedKeys, null, 2)};`;
  fs.writeFileSync(file, content);
  res.json({ apiKey: newKey });
});

export default router;
