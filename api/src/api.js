const express = require("express");
const cors = require("cors");
const app = express();
const os = require("os");
const bodyParser = require("body-parser");
const logger = require("morgan");

//Import routes
const apiRouter1 = require("./router/apiv1");
const apiRouter2 = require("./router/patch");
const apiRouter3 = require("./router/machine");
const apiRouter4 = require("./router/apiv2");
//Import port configuration
const port = process.env.API_PORT || 1000;

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(logger("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1", apiRouter1);
app.use("/api/v1", apiRouter2);
app.use("/api/v1", apiRouter3);
app.use("/api/v1", apiRouter4);

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
