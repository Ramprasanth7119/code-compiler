const express = require("express");
const apiKeyStore = require("./apiKeyStore");
const router = express.Router();

// Create new key
router.post("/generate-key", (req, res) => {
  const { owner } = req.body;
  const key = apiKeyStore.generate(owner || "guest");
  res.json({ apiKey: key });
});

// Revoke a key
router.post("/revoke-key", (req, res) => {
  const { key } = req.body;
  apiKeyStore.revoke(key);
  res.json({ message: "Key revoked" });
});

// List keys (admin only)
router.get("/keys", (req, res) => {
  res.json(apiKeyStore.list());
});

module.exports = router;
