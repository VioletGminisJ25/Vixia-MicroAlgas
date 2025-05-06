// server.js
const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: "http://localhost:4321", // puerto del frontend Astro
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    socket.on("message", (msg) => {
        console.log("Mensaje recibido del cliente:", msg);
        socket.emit("response", "Hola desde el servidor de Node!");
    });

    socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
    });
});

server.listen(5000, () => {
    console.log("Servidor Socket.IO escuchando en http://localhost:5000");
});