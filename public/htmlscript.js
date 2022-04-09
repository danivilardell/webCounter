let clientId = null;
let counterId = null;
let ws = new WebSocket("ws://https://sync-counter.herokuapp.com:8080")
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

  ws.send(JSON.stringify(payLoad));
})

btnJoin.addEventListener("click", e => {

  if(counterId == null) counterId = txtCounterId.value;

  const payLoad = {
    "method": "join",
    "clientId": clientId,
    "counterId": counterId
  }

  ws.send(JSON.stringify(payLoad));
})

btnUp.addEventListener("click", e => {

  const payLoad =  {
    "method": "up",
    "clientId": clientId,
    "counterId": counterId
  }

  ws.send(JSON.stringify(payLoad));
})

btnDown.addEventListener("click", e => {

  const payLoad =  {
    "method": "down",
    "clientId": clientId,
    "counterId": counterId
  }

  ws.send(JSON.stringify(payLoad));
})

ws.onmessage = message => {
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

}
