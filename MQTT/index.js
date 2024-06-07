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

const topics = ['/#']

client.on('connect', () => {
  console.log('Connected')

  client.subscribe(topics, () => {
    console.log(`Subscribed to topics: ${topics.join(', ')}`)
  })
})

client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())

  axios.post('http://storage:4000/devices', {
    topic,
    message: payload.toString()
  })
  .then(response => console.log(response.data))
  .catch(error => console.error('Error storing data:', error));
})
