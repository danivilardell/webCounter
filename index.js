const http = require("http");
const app = require("express")();
app.get("/", (req,res)=> res.sendFile(__dirname + "/index.html"))

app.listen(8081, ()=>console.log("Listening on http port 8081"))
const websocketServer = require("websocket").server;
const httpServer = http.createServer();
httpServer.listen(8080, () => console.log("Listening on 8080"));

const clients = {};
const counters = {};

const wsServer = new websocketServer({
  "httpServer": httpServer
})

wsServer.on("request", request => {
  //connect
  const connection = request.accept(null, request.origin);
  connection.on("open",  () => console.log("Connection established"))
  connection.on("close",  () => console.log("Connection closed"))
  connection.on("message",  message => {
    const result = JSON.parse(message.utf8Data);

    if(result.method === "create") {
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
      con.send(JSON.stringify(payLoad));
    }

    if(result.method === "join") {
      const clientId = result.clientId;
      const counterId = result.counterId;
      const counter = counters[counterId];

      counter.clients.push({
        "clientId": clientId
      })

      const payLoad = {
        "method": "join",
        "counter": counter
      }

      counter.clients.forEach(c=>{
        clients[c.clientId].connection.send(JSON.stringify(payLoad));
      })
    }

    if(result.method === "up" || result.method === "down") {
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
        clients[c.clientId].connection.send(JSON.stringify(payLoad));
      })
    }
  });

  //generate new unique clientId
  const clientId = guid();
  clients[clientId] = {
    "connection": connection
  }

  const payLoad = {
    "method": "connect",
    "clientId": clientId
  }
  //Send back client connect
  connection.send(JSON.stringify(payLoad))

})

// GUID generator
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
