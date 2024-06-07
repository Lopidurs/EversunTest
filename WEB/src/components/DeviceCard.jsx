/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Grid, Typography, Switch, CardContent, Card, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";

export default function DeviceCard(props) {
  const [deviceData, setDeviceData] = useState({ });

  useEffect(() => {
    console.log(props)
    setDeviceData({
      topic: props.topic || " - ",
      deviceName: props.deviceName || " - ",
      currentPower: props.currentPower || " - ",
      totalPowerConsumption: props.totalPowerConsumption || " - ",
      state: props.state || "NO CONNECTION",
    });
    setChecked(props.state === "ON");
  }, [props]);

  const [checked, setChecked] = useState(true);

  const handleChange = (event) => {
    let newStatus;
    setChecked(event.target.checked);
    event.target.checked
      ? (newStatus = '{"state" : "ON"}')
      : (newStatus = '{"state" : "OFF"}');
      axios.post(
        `http://localhost:3000/devices${props.topic}/set`,
        JSON.parse(newStatus)
      );
  };

  return (
    <Card sx={{ width: 500, margin: 2, position: 'relative' }}>
       <IconButton
        aria-label="close"
        onClick={() => props.onClose(deviceData.topic)}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <CardContent>
        <Grid container alignItems="center">
          <Grid item xs={10}>
            <Typography
              variant="h6"
              component="div"
              gutterBottom={false}
              align="left"
            >
              <strong>Device Name:</strong> {deviceData.deviceName}
            </Typography>
            <Typography
              variant="h6"
              component="div"
              gutterBottom={false}
              align="left"
            >
              <strong>Topic:</strong> {deviceData.topic}
            </Typography>
            <Typography
              variant="h6"
              component="div"
              gutterBottom={false}
              align="left"
            >
              <strong>Current Power:</strong> {deviceData.currentPower}
            </Typography>
            <Typography
              variant="h6"
              component="div"
              gutterBottom={false}
              align="left"
            >
              <strong>Total Power Consumption:</strong>{" "}
              {deviceData.totalPowerConsumption}
            </Typography>
            <Typography
              variant="h6"
              component="div"
              gutterBottom={false}
              align="left"
            >
              <strong>State:</strong> {deviceData.state}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Switch checked={checked} onChange={handleChange} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
