const apiKeyStore = require("./apiKeyStore");

module.exports = (req, res, next) => {
  const key = req.headers["x-api-key"];
  if (!key || !apiKeyStore.isValid(key)) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }
  next();
};
