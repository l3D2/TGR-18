const mqtt = require("mqtt");
const db = require("./mongodb");
const model = require("./model/schema");
const config = {
  mqttHost: process.env.MQTT_HOST,
  mqttPort: process.env.MQTT_PORT,
  mqttUsername: process.env.MQTT_USERNAME,
  mqttPassword: process.env.MQTT_PASSWORD,
};

let client;
let isConnected = false;

async function connectToBroker() {
  try {
    client = await mqtt.connectAsync(
      // `mqtt://localhost:${config.mqttPort}`,
      `mqtt://host.docker.internal:${config.mqttPort}`,
      {
        // username: "tgr",
        // password: "admin",
        username: config.mqttUsername,
        password: config.mqttPassword,
        clientId: "mqtt-service",
        clean: true,
        reconnectPeriod: 1000, // Reconnect automatically after 1 second
        connectTimeout: 30 * 1000,
      }
    );

    isConnected = true;
    console.log("Connected to MQTT broker");

    // Subscribe to topics
    client.subscribe("BD2", (err) => {
      if (err) {
        console.error("Failed to subscribe to topics:", err);
      } else {
        console.log("Subscribed to all topics");
      }
    });

    client.on("message", async (topic, message) => {
      console.log(`Received message on topic ${topic}: ${message.toString()}`);
      const jsonMessage = JSON.parse(message.toString());
      await db.connect();
      try {
        const newData = new model.schema({
          ts: jsonMessage.timestamp,
          message: jsonMessage.text,
        });
        const result = await newData.save();
        // Send response after saving the data
        console.log("Added message to database");
      } catch (error) {
        console.error("Failed to save message to database:");
      } finally {
        // Ensure database disconnect regardless of success or failure
        await db.disconnect();
      }
    });

    client.on("reconnect", () => {
      console.log("Attempting to reconnect to MQTT broker...");
    });

    client.on("disconnect", () => {
      console.log("Disconnected from MQTT broker");
      isConnected = false;
    });

    client.on("error", (error) => {
      console.log("MQTT client error:", error);
      isConnected = false;
      attemptReconnect();
    });
  } catch (error) {
    console.log("Initial connection attempt failed:", error);
    isConnected = false;
    attemptReconnect();
  }
}

// Reconnect logic if not connected
function attemptReconnect() {
  if (!isConnected) {
    console.log("Attempting to reconnect...");
    setTimeout(connectToBroker, 5000); // Retry every 5 seconds
  }
}

connectToBroker();
