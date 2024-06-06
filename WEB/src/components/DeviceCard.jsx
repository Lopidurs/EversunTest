import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const socket = io('ws://localhost:4000');

export default function BasicCard() {
  const [deviceData, setDeviceData] = useState({
    topic: ' - ',
    deviceName: ' - ',
    currentPower: ' - ',
    totalPowerConsumption: ' - ',
    state: 'NO CONNECTION'
  });

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('message', (data) => {
      console.log('Received new data:', data);
      setDeviceData({
        topic: data.topic,
        deviceName: data.deviceName,
        currentPower: data.currentPower,
        totalPowerConsumption: data.totalPowerConsumption,
        state: data.state
      });
    });

    return () => {
      socket.off('new-data');
    };
  }, []);

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="body1">
            Topic: {deviceData.topic}
        </Typography>
        <Typography variant="body1">
            Device name: {deviceData.deviceName}
        </Typography>
        <Typography variant="body1">
            Current Power: {deviceData.currentPower}
        </Typography>
        <Typography variant="body1">
            Total Power Consumption: {deviceData.totalPowerConsumption}
        </Typography>
        <Typography variant="body1">
            State: {deviceData.state}
        </Typography>
        
      </CardContent>
    </Card>
  );
}
