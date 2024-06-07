import './App.css'
import { useState, useEffect } from "react";
import io from "socket.io-client";
import DeviceCard from './components/DeviceCard'
import SelectionCard from './components/SelectionTopic';

function App() {
  const [devices, setDevices] = useState({});
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [newTopic, setNewTopic] = useState("");

  useEffect(() => {
    const socket = io(`ws://localhost:4000`);
    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("message", (data) => {
      setDevices(prevDevices => {
        return {
          ...prevDevices,
          [data.topic]: data
        };
      });
      console.log(devices)
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const handleAddTopic = () => {
    if (newTopic && !selectedDevices.includes(newTopic)) {
      setSelectedDevices([...selectedDevices, newTopic]);
      setNewTopic("");
    }
  }

  const onClose = (topic) => {
    setSelectedDevices(selectedDevices => 
      selectedDevices.filter(selectedTopic  => selectedTopic  !== topic)
    )
  }

  return (
    <>
      <h1>Eversun</h1>
      <SelectionCard newTopic={newTopic} setNewTopic={setNewTopic} handleAddTopic={handleAddTopic}/>
      {selectedDevices.map(topic => (
        <DeviceCard key={topic} {...devices[topic]} topic={topic} onClose={onClose} />
      ))}
    </>
  )
}

export default App
