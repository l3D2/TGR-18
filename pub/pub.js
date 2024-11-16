const mqtt = require("mqtt");

// MQTT broker address and credentials
const brokerUrl = "mqtt://host.docker.internal:1883"; // Replace with your broker address
const username = "tgr"; // Replace with your MQTT username
const password = "admin"; // Replace with your MQTT password

// Connect to the MQTT broker with authentication
const client = mqtt.connect(brokerUrl, {
  username: username,
  password: password,
});

client.on("connect", () => {
  console.log("Connected to MQTT broker");

  // Publish a message every 2 seconds
  setInterval(() => {
    const message = JSON.stringify({
      text: "Hello, MQTT with auth!",
      timestamp: new Date(),
    });
    const topic = "BD2"; // Replace with your desired topic
    client.publish(topic, message, () => {
      console.log(
        `"${new Date().toLocaleString()}" | Message sent to topic "${topic}": ${message}`
      );
    });
  }, 6000); // 2000 ms = 2 seconds
});

client.on("error", (err) => {
  console.error("Connection failed:", err);
});
