const http = require("http");
const express = require("express");
var path = require('path');
const app = express();
var public = path.join(__dirname, 'public');
app.get("/", (req,res)=> res.sendFile(__dirname + "/index.html"))
app.use('/', express.static(public));

const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer);
httpServer.listen(process.env.PORT || 8080);

const clients = {};
const counters = {};

io.on("connection", (socket) => {

  socket.on("create", (msg) => {
    const result = JSON.parse(msg);
    const clientId = result.clientId;
    const counterId = guid();
    counters[counterId] = {
      "id": counterId,
      "clients": [],
      "value": 0
    }

    const payLoad = {
      "method": "create",
      "counter": counters[counterId]
    }

    const con = clients[clientId].connection;
    con.emit("create", JSON.stringify(payLoad));
  })

  socket.on("join", (msg) => {
    const result = JSON.parse(msg);
    const clientId = result.clientId;
    const counterId = result.counterId;
    const counter = null;
    if(counters[counterId] !== undefined) {
      counter = counters[counterId];
      counter.clients.push({
        "clientId": clientId
      })

      const payLoad = {
        "method": "join",
        "counter": counter
      }

      counter.clients.forEach(c=>{
        clients[c.clientId].connection.emit("join", JSON.stringify(payLoad));
      })
    }
    else {
      const payLoad = {
        "method": "error",
        "msg": "No counter with this ID found"
      }
      const con = clients[clientId].connection;
      con.emit("error", JSON.stringify(payLoad));
    }

  })

  socket.on("updateValue", (msg) => {
    const result = JSON.parse(msg);
    const counterId = result.counterId;
    const clientId = result.clientId;

    counter = counters[counterId];
    if(result.method === "up") counter.value++;
    else counter.value--;

    const payLoad = {
      "method": "updateValue",
      "value": counter.value
    }

    counter.clients.forEach(c=>{
      clients[c.clientId].connection.emit("updateValue", JSON.stringify(payLoad));
    })
  })

  const clientId = guid();
  clients[clientId] = {
    "connection": socket
  }
  console.log("connection established with client " + clientId);

  const payLoad = {
    "method": "connect",
    "clientId": clientId
  }
  //Send back client connect
  socket.emit("connection", JSON.stringify(payLoad));
});

// GUID generator
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
