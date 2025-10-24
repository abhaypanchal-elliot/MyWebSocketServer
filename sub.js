const { Server } = require("socket.io");
const cors = require("cors");
const config = require("./config");
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
app.use(cors());
const http = require("http");
const https = require("https");
const mqtt = require("mqtt");
var client = mqtt.connect("mqtt://elliotsystemsonline.com");

const httpsOptions = {
  pfx: fs.readFileSync(path.resolve(__dirname, "./TempSSL/pfxCertificate.pfx")),
  passphrase: "elliot", // The password you set when exporting the PFX
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(httpsOptions, app);

const io = new Server(httpsServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://iiot.elliotsystemsonline.com",
      "http://iiot.elliotsystemsonline.com",
      "http://localhost:8081",
      "https://localhost:8081",
      "https://uo.elliotsystemsonline.com",
      "https://elliot-iiot-frontend-user.vercel.app",
      "https://elliot-iiot-frontend-admin.vercel.app",
      "https://elliot-frontend-super-admin.vercel.app",
      "https://elliot-iiot-frontend-admin.onrender.com",
      "https://elliot-iiot-frontend-user.onrender.com",
    ],
    methods: ["GET", "POST"],
  },
});

// const test = require('./asset')
// let topic = ""
// let socketInstance;
const io2 = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://iiot.elliotsystemsonline.com",
      "http://iiot.elliotsystemsonline.com",
      "http://localhost:8081",
      "https://localhost:8081",
      "https://uo.elliotsystemsonline.com",
      "https://elliot-iiot-frontend-user.vercel.app",
      "https://elliot-iiot-frontend-admin.vercel.app",
      "https://elliot-frontend-super-admin.vercel.app",
      "https://elliot-iiot-frontend-admin.onrender.com",
      "https://elliot-iiot-frontend-user.onrender.com",
    ],
    methods: ["GET", "POST"],
  },
});
client.on("connect", function () {
  client.subscribe("ELLIOT/#");
  // console.log('client has subscribed successfully ELLIOT/#');
});

io.on("connection", (socket) => {
  // console.log("User Connected : ",socket.id);
  socket.on("disconnect", function () {
    // console.log("user disconnection",socket.id)
  });
});

io2.on("connection", (socket) => {
  // console.log("User Connected : ",socket.id);
  socket.on("disconnect", function () {
    // console.log("user disconnection",socket.id)
  });
});

// Single MQTT message handler that emits to all sockets on both io and io2
client.on("message", async function (topic, message) {
  try {
    //latest code with ema and mma live handling
    // console.log(topic)
    if (
      topic.split("/")[1] == "EMA" ||
      topic.split("/")[1] == "TMA" ||
      topic.split("/")[1] == "FMA" ||
      topic.split("/")[1] == "OAG" ||
      topic.split("/")[1] == "DG" ||
      topic.split("/")[1] == "OPC"
    ) {
      let gatewayId = topic.split("/")[2];
      let test1 = JSON.parse(message);
      test1.GatewayId = gatewayId;
      io.sockets.emit(
        `${gatewayId}/${test1.Slave_id ? test1.Slave_id : 1}`,
        test1
      );
      io2.sockets.emit(
        `${gatewayId}/${test1.Slave_id ? test1.Slave_id : 1}`,
        test1
      );
      if (topic.split("/")[1] == "TMA") {
        io.sockets.emit("SENSOR/ALERT", test1);
        io2.sockets.emit("SENSOR/ALERT", test1);
      }
    } else if (topic.split("/")[1] == "MMA") {
      let gatewayId = topic.split("/")[2];
      var test1 = JSON.parse(message);
      if (test1["Exception"] == undefined && test1.Status) {
        test1.GatewayId = gatewayId;
        io.sockets.emit(`${gatewayId}`, test1);
        io2.sockets.emit(`${gatewayId}`, test1);
        io.sockets.emit("FAULT", test1);
        io2.sockets.emit("FAULT", test1);
      }
    }
    //last updated code before mma add
    // gatewayId = topic.split('/')[2]
    // let test1 = JSON.parse(message);
    // test1.GatewayId = gatewayId;
    // io.sockets.emit(`${gatewayId}/${test1?.Slave_id}`,test1);
    // io2.sockets.emit(`${gatewayId}/${test1?.Slave_id}`,test1);
    //parmanat comment code
    // // console.log(test1 , ">>>>>>>>>>>>>>>>", gatewayId)
    // // if(gatewayId == 'AB1'){
    // //   test1.Gateway_id = gatewayId
    // //  io.sockets.emit("ELLIOT",test1);
    // //  io2.sockets.emit("ELLIOT",test1);
    // // }
  } catch (error) {
    // throw error;
    // console.log(error)
  }
});
httpsServer.listen(config.HTTPS_PORT);
httpServer.listen(config.HTTP_PORT);
