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
  Device.findOne({ deviceName: 'smartPlug1' }).then((data) => {
    if (!data) {
      console.log('No device found');
    } else {
      const device = new Device({
        topic: data.topic,
        deviceName: data.deviceName,
        currentPower: data.currentPower,
        totalPowerConsumption: data.totalPowerConsumption,
        state: data.state
      });
      io.emit('message', device);
    }
  }).catch((err) => console.log(err))


  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.post('/devices', (req, res) => {
  const { topic, message } = req.body;
  const data = JSON.parse(message);

  const device = new Device({
    topic: topic,
    deviceName: data.deviceName,
    currentPower: data.currentPower,
    totalPowerConsumption: data.totalPowerConsumption,
    state: data.state
  });

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
