// Real-time key storage (in production, use DB instead)
const apiKeys = new Map();

// Add a default dev key
apiKeys.set("immortals", { owner: "admin", active: true });

module.exports = {
  isValid(key) {
    return apiKeys.has(key) && apiKeys.get(key).active;
  },

  generate(owner = "guest") {
    const key = `KEY_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
    apiKeys.set(key, { owner, active: true });
    return key;
  },

  revoke(key) {
    if (apiKeys.has(key)) apiKeys.get(key).active = false;
  },

  list() {
    return Array.from(apiKeys.entries());
  }
};
