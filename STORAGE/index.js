const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const cors = require('cors');

mongoose.connect('mongodb://localhost:27017/eversun', {});

const deviceSchema = new mongoose.Schema({
  topic: String,
  deviceName: String,
  currentPower: String,
  totalPowerConsumption: String,
  state: String,
  timestamp: { type: Date, default: Date.now }
});
const Device = mongoose.model('Device', deviceSchema, "devices");


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

app.use(cors());
app.use(bodyParser.json());


io.on('connection', (socket) => {
  console.log('A user connected');

  Device.aggregate([
    {
      $sort: { timestamp: -1 }
    },
    {
      $group: {
        _id: "$topic",
        doc: { $first: "$$ROOT" }
      }
    }
  ]).then((result) => {
    if (result.length === 0) {
      console.log('No devices found');
    } else {
      result.forEach(({ doc }) => {
        const device = {
          topic: doc.topic,
          deviceName: doc.deviceName,
          currentPower: doc.currentPower,
          totalPowerConsumption: doc.totalPowerConsumption,
          state: doc.state
        };
        io.emit('message', device);
      });
    }
  }).catch((err) => console.log(err));



  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.post('/devices', async (req, res) => {
  let { topic, message } = req.body;
  const data = JSON.parse(message);
  let deviceToUpdate;

  if (topic.split('/').pop() === "set") {
    topic = topic.slice(0, -4);

    deviceToUpdate = await Device.findOne({ topic: topic }).sort({ timestamp: -1 })
    if (!deviceToUpdate) {
      return res.status(404).send('Device not found');
    }
  }

  const device = new Device({
    topic: topic,
    deviceName: data.deviceName === undefined ? deviceToUpdate.deviceName : data.deviceName ,
    currentPower: data.currentPower === undefined ? deviceToUpdate.currentPower : data.currentPower,
    totalPowerConsumption: data.totalPowerConsumption === undefined ? deviceToUpdate.totalPowerConsumption : data.totalPowerConsumption,
    state: data.state === undefined ? deviceToUpdate.state : data.state,
})


  device.save()
    .then(() => {
      res.status(201).send('Data stored successfully');
      io.emit('message', device);
    })
    .catch(error => res.status(500).send('Error storing data:', error));
});



server.listen(4000, () => {
  console.log('Storage service running on port 4000');
});
