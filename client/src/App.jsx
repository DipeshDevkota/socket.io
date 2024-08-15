import React, { useEffect, useState, useMemo } from 'react';
import { io } from 'socket.io-client';
import { Button, Container, Stack, TextField, Typography } from '@mui/material';

const App = () => {
    const socket = useMemo(() => io("http://localhost:3001", { withCredentials: true }), []);
    const [roomname, setRoomname] = useState("");
    const [message, setMessage] = useState("");
    const [room, setRoom] = useState("");
    const [socketId, setSocketId] = useState("");
    const [messages, setMessages] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit("message", { message, room });
        setMessage("");
    };

    const joinRoom = (e) => {
        e.preventDefault();
        socket.emit("join-room", roomname);
        setRoomname('');
    };

    useEffect(() => {
        socket.on("connect", () => {
            setSocketId(socket.id);
            console.log('Connected', socket.id);
        });

        socket.on("receive-message", (data) => {
            console.log(data);
            setMessages((messages) => [...messages, data]);
        });

        socket.on("disconnect", () => {
            console.log('Disconnected');
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);

    return (
        <Container maxWidth='sm'>
            <Typography variant='h6' component='div' gutterBottom>
                {socketId}
            </Typography>

            <form onSubmit={joinRoom}>
                <h5>Join Room</h5>
                <TextField
                    value={roomname}
                    onChange={e => setRoomname(e.target.value)}
                    id='outlined-basic'
                    label='Room Name'
                    variant='outlined'
                />
                <Button type='submit' variant='contained' color='primary'>
                    Join
                </Button>
            </form>

            <form onSubmit={handleSubmit}>
                <TextField
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    id='outlined-basic'
                    label='Message'
                    variant='outlined'
                />
                <TextField
                    value={room}
                    onChange={e => setRoom(e.target.value)}
                    id='outlined-basic'
                    label='Room'
                    variant='outlined'
                />
                <Button type='submit' variant='contained' color='primary'>
                    Send
                </Button>
            </form>

            <Stack>
                {messages.map((m, i) => (
                    <Typography key={i} variant='h6' component='div' gutterBottom>
                        {m}
                    </Typography>
                ))}
            </Stack>
        </Container>
    );
};

export default App;
