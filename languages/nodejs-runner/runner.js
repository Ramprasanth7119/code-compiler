const { execSync } = require("child_process");
try {
  const result = execSync("node user_code.js", { timeout: 3000 });
  console.log(result.toString());
} catch (err) {
  console.error("Error:", err.message);
}
