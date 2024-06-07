/* eslint-disable react/prop-types */
import { Typography, CardContent, Card, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function SelectionCard(props) {
  return (
    <Card sx={{ width: 500, margin: 2 }}>
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          gutterBottom={false}
          align="left"
        >
          Select Devices to Display
        </Typography>
        <TextField
          id="standard-basic"
          label="New topic"
          variant="standard"
          value={props.newTopic}
          onChange={(e) => props.setNewTopic(e.target.value)}
        />
        <IconButton onClick={props.handleAddTopic}>
            <SendIcon  />
        </IconButton>
      </CardContent>
    </Card>
  );
}
