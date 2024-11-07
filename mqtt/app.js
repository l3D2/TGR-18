const mqtt = require("mqtt");

const config = {
  mqttHost: process.env.MQTT_HOST,
  mqttPort: process.env.MQTT_PORT,
  mqttUsername: process.env.MQTT_USERNAME,
  mqttPassword: process.env.MQTT_PASSWORD,
};

let client;
(async () => {
  try {
    client = await mqtt.connectAsync(
      `mqtt://${config.mqttHost}:${config.mqttPort}`,
      {
        username: config.mqttUsername,
        password: config.mqttPassword,
        clientId: "mqtt-service",
        clean: false,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
      }
    );
    console.log("Connected to MQTT broker");

    // Subscribe all to topics can chance # to specific topic
    client.subscribe("#", (err) => {
      if (err) {
        console.error("Failed to subscribe to topics:", err);
      } else {
        console.log("Subscribed to all topics");
      }
    });

    client.on("message", (topic, message) => {
      console.log(`Received message on topic ${topic}: ${message.toString()}`);
    });
  } catch (error) {
    console.error("Failed to connect to MQTT broker:", error);
  }
})();
