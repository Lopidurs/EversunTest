const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/eversun', {});

const deviceSchema = new mongoose.Schema({
  deviceName: String,
  currentPower: String,
  totalPowerConsumption: String,
  state: String,
  timestamp: { type: Date, default: Date.now }
});


const app = express();
app.use(bodyParser.json());

app.post('/devices', (req, res) => {
  const { topic, message } = req.body;
  const data = JSON.parse(message);
  const Device = mongoose.model('Device', deviceSchema, topic);

  const device = new Device({
    deviceName: data.deviceName,
    currentPower: data.currentPower,
    totalPowerConsumption: data.totalPowerConsumption,
    state: data.state
  });

  device.save()
    .then(() => res.status(201).send('Data stored successfully'))
    .catch(error => res.status(500).send('Error storing data:', error));
});

app.listen(4000, () => {
  console.log('Storage service running on port 4000');
});
