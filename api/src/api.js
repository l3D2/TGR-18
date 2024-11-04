const express = require("express");
const app = express();
const os = require("os");

//Import port configuration
const port = process.env.API_PORT || 1000;

app.get("/", (req, res) => {
  res.status(200).json({ message: "API Running.", status: "OK" });
});

function getIPv4Address() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const details of iface) {
      if (details.family === "IPv4" && !details.internal) {
        return details.address;
      }
    }
  }
  return "localhost"; // Default if no external IPv4 address is found
}

function startService() {
  app.listen(port, () => {
    const host = getIPv4Address();
    console.log(`Server running at http://${host}:${port}/`);
  });
}

// Export the app and startServer function
module.exports = { startService };
