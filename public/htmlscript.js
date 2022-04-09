let clientId = null;
let counterId = null;
let socket = io();
const btnCreate = document.getElementById("btnCreate");
const btnJoin = document.getElementById("btnJoin");
const txtCounterId = document.getElementById("txtCounterId");
const btnUp = document.getElementById("btnUp");
const btnDown = document.getElementById("btnDown");
const counterValue = document.getElementById("counterValue");
const counterIdHtml = document.getElementById("counterId");

btnCreate.addEventListener("click", e => {
  counterValue.innerHTML = 0;
  const payLoad = {
    "method": "create",
    "clientId": clientId
  }

  socket.emit("create", JSON.stringify(payLoad));
})

btnJoin.addEventListener("click", e => {

  if(counterId == null) counterId = txtCounterId.value;

  const payLoad = {
    "method": "join",
    "clientId": clientId,
    "counterId": counterId
  }

  socket.emit("join", JSON.stringify(payLoad));
})

btnUp.addEventListener("click", e => {

  const payLoad =  {
    "method": "up",
    "clientId": clientId,
    "counterId": counterId
  }

  socket.emit("updateValue", JSON.stringify(payLoad));
})

btnDown.addEventListener("click", e => {

  const payLoad =  {
    "method": "down",
    "clientId": clientId,
    "counterId": counterId
  }

  socket.emit("updateValue", JSON.stringify(payLoad));
})

socket.on("connection", function(msg) {
  const response = JSON.parse(msg);
  clientId = response.clientId;
  console.log("Client id Set successfully " + clientId)
});

socket.on("create", function(msg) {
  const response = JSON.parse(msg);
  counterId = response.counter.id;
  console.log("Counter successfully created with id " + counterId);
  counterIdHtml.innerHTML = "Counter ID: " + counterId;
});

socket.on("join", function(msg) {
  const response = JSON.parse(msg);
  counterId = response.counter.id;
  console.log("Counter successfully joined with id " + counterId);
  counterIdHtml.innerHTML = "Counter ID: " + counterId;
});

socket.on("updateValue", function(msg) {
  const response = JSON.parse(msg);
  counterValue.innerHTML = response.value;
  console.log("Counter value updated with " + response.value);
});

/*socket.onmessage = message => {
  const response = JSON.parse(message.data);
  if(response.method === "connect") {
    clientId = response.clientId;
    console.log("Client id Set successfully " + clientId)
  }

  if(response.method === "create") {
    counterId = response.counter.id;
    console.log("Counter successfully created with id " + counterId);
    counterIdHtml.innerHTML = "Counter ID: " + counterId;
  }

  if(response.method === "join") {
    counterId = response.counter.id;
    console.log("Counter successfully joined with id " + counterId);
    counterIdHtml.innerHTML = "Counter ID: " + counterId;
  }

  if(response.method === "updateValue") {
    counterValue.innerHTML = response.value;
    console.log("Counter value updated with " + response.value);
  }

}*/
