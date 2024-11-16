const mqtt = require("mqtt");

function generateRandomSoundData() {
  const maxClipLength = 360; // 6 minutes in seconds
  const soundData = [];
  let currentTime = 0; // Start time in seconds

  while (currentTime < maxClipLength) {
    // Randomly decide the interval (e.g., between 1 and 10 seconds)
    const interval = Math.floor(Math.random() * 10) + 1;

    // Randomly decide the prediction ("Normal" or "Faulty")
    const prediction = Math.random() > 0.8 ? "Faulty" : "Normal"; // 80% Normal, 20% Faulty

    // Add the data point
    soundData.push({
      time: currentTime.toFixed(2), // Keep the time as a floating point number with 2 decimal places
      prediction,
    });

    // Increment the time by the interval
    currentTime += interval;

    // Ensure the time does not exceed maxClipLength
    if (currentTime > maxClipLength) break;
  }

  return soundData;
}

// MQTT WebSocket connection
const username = "tgr";
const password = "tgr18";
const client = mqtt.connect("ws://210.246.215.31:8083", {
  username,
  password,
});

client.on("connect", () => {
  console.log("Connected to MQTT WebSocket");

  // Generate random sound data
  const simulatedData = generateRandomSoundData();

  // Send each data point to the MQTT topic
  simulatedData.forEach((dataPoint, index) => {
    setTimeout(() => {
      const message = JSON.stringify(dataPoint);
      client.publish("main/predict", message, (err) => {
        if (err) {
          console.error("Error publishing message:", err);
        } else {
          console.log(`Published: ${message}`);
        }
      });
    }, index * 400); // Publish one data point per second
  });
});

client.on("error", (error) => {
  console.error("MQTT connection error:", error);
});
