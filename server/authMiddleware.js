import apiKeys from "./apiKeyStore.js";

export default function (req, res, next) {
  const key = req.headers["x-api-key"];
  if (!key || !apiKeys.includes(key)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
