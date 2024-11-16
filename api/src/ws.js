const db = require("./mongodb");
const model = require("./model/schema");

const connectWs = () => {
  const client = new WebSocket("ws://158.108.97.12:8000/ws");

  client.onopen = () => {
    console.log("WebSocket connected");
    client.send("37e2a03864abf29ff4409bc2711341da");
  };

  client.onmessage = async (message) => {
    if (message.data === "Connection authorized") {
      console.log("Connection authorized");
      await db.connect();
    } else {
      const data = JSON.parse(message.data);
      // Save data to MongoDB
      try {
        const newData = new model.machineSchema({
          ts: Math.floor(Date.now() / 1000),
          power: data["Energy Consumption"].Power,
          L1_GND: data["Voltage"]["L1-GND"],
          L2_GND: data["Voltage"]["L2-GND"],
          L3_GND: data["Voltage"]["L3-GND"],
          pressure: data.Pressure,
          force: data.Force,
          cycle_count: data["Cycle Count"],
          PoP: data["Position of the Punch"],
        });
        const result = await newData.save(); // Call save() to store the document in MongoDB
        console.log("Data saved to MongoDB:");
      } catch (error) {
        console.error("Error connecting to MongoDB:", error);
      }
    }
  };

  client.onclose = async () => {
    console.log("WebSocket closed. Reconnecting...");
    setTimeout(connectWs, 1000);
    await db.disconnect();
  };
};

connectWs();
