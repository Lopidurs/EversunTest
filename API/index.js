const express = require('express'); 
const mqtt = require('mqtt');

const app = express()
app.use(express.json());

const host = 'broker.emqx.io' 
const port = '1883' 
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`

const mqttClient = mqtt.connect(connectUrl, {
        clientId,
        clean: true,
        connectTimeout: 4000,
        username: 'endurs',
        password: 'test',
        reconnectPeriod: 1000,
    })

mqttClient.on('connect', function () { 
    console.log('Connected to MQTT broker') 
})

app.use(function (req, res, next) {
    // Publish messages
    req.mqttPublish = function (topic, message) {
      mqttClient.publish(topic, message)
    }
    
    next()
  })


app.post('/devices/:topic/:deviceName/set', function (req, res) { 
    console.log('Received request:', req.body);  
    const { deviceName } = req.params; 
    const { topic } = req.params;

    req.mqttPublish(`/${topic}/${deviceName}/set`, JSON.stringify(req.body))

    res.send(`State published in ${topic}/${deviceName}/set`) 
})

app.listen(3000, function () { 
    console.log('Server is running on port 3000') 
})

