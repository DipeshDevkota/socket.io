const express = require('express')
const { Server } = require('socket.io')
const {createServer} = require('http')
const port = 3000;
const cors = require('cors')

const app = express()
const server = createServer(app);

const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true,
    }
});
//socket.io
io.on("connection",(socket)=>{

    console.log("User connected",socket.id);
    // socket.emit("welcome",`Welcome to the server.`);
    // socket.broadcast.emit("Welcome",`${socket.id} joined the server.`)

     socket.on("message",({room,message})=>{
        console.log({room,message});
        io.to(room).emit('receive-message',message)
     }) 

    
   

    socket.on("disconnect",()=>{
        console.log('User disconnected',socket.id)
    });

});


app.get('/', (req, res) => {
    res.send("Hello ");
})


// app.use(cors(
//     {
//     origin:"http://localhost:5173",
//     methods:["GET","POST"],
//     credentials:true,
//     }

// ))


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




