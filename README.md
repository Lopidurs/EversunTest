# Eversun Technical Test
This project aims to develop a web application for logging and displaying information sent by fictitious devices using the MQTT protocol.
The project is structured as microservices, consisting of the following modules: STORAGE, WEB, API, and MQTT.

## Broker
This aplication use the public broker from `broker.emqx.io`.  
**MQTT Broker Info**
```
Server: broker.emqx.io
TCP Port: 1883
WebSocket Port: 8083
SSL/TLS Port: 8883
Secure WebSocket Port: 8084
```
## Installation
To launch the application, execute the following command at the root of the project:

```bash
docker-compose up --build
```

## Security
Please note that no security measures have been implemented at the moment.

## Features
### MQTT
The MQTT service only connect to a broker and subscribe to pic. When there is a new publish in the topic it fordwards it to the STORAGE service.

### STORAGE
The storage is the connexion to the database, it store all information send by the MQTT service in the database and emit it in a websockets to the front.

### API
The api service is where the front send request when he need to, like updating a status.

### Frontend (WEB)
Allows selecting the device for which to view information.
Displays device information in real-time upon each new publication.
Shows the latest recorded information if no message is published.
Includes an ON/OFF button to control the device state, triggering publication on the corresponding topic.

### Technologies Used
- React/vite
  - MUI for fast css
- node.js/Express
  - axios for REST
  - socket.io for websockets
- mongoDB
