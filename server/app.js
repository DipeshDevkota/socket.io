const express = require('express');
const { Server } = require('socket.io');
const { createServer } = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const SECRETKEY = 'dipesh';
const port = 3001;

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
}));

app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Hello ");
});

app.get('/login', (req, res) => {
    const token = jwt.sign({ _id: "dadad" }, SECRETKEY);
    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" })
       .json({ message: "Login success" });
});

io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, (err) => {
        if (err) return next(err);

        const token = socket.request.cookies.token;
        if (!token) return next(new Error("Authentication Error"));

        try {
            jwt.verify(token, SECRETKEY);
            next();
        } catch (error) {
            next(new Error("Invalid Token"));
        }
    });
});

io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("message", ({ room, message }) => {
        console.log({ room, message });
        io.to(room).emit('receive-message', message);
    });

    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`User joined room ${room}`);
    });

    socket.on("disconnect", () => {
        console.log('User disconnected', socket.id);
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
