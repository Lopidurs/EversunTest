const mqtt = require('mqtt')
const axios = require('axios');

const host = 'broker.emqx.io'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'endurs',
  password: 'test',
  reconnectPeriod: 1000,
})

const topic = '/EversunTest/smartPlug1'
const test = JSON.stringify({
  deviceName: "smartPlug1",
  currentPower: "180W",
  totalPowerConsumption: "7.4kWh",
  state: "ON"
})

client.on('connect', () => {
  console.log('Connected')

  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
    client.publish(topic, test, { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error)
      }
    })
  })
})

client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())

  axios.post('http://localhost:4000/devices', {
    topic,
    message: payload.toString()
  })
  .then(response => console.log(response.data))
  .catch(error => console.error('Error storing data:', error));
})
