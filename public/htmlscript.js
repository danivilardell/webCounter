let clientId = null;
let counterId = null;
let socket = io();
const btnCreate = document.getElementById("btnCreate");
const btnJoin = document.getElementById("btnJoin");
const txtCounterId = document.getElementById("txtCounterId");
let btnUp = null;
let btnDown = null;
let counterValue = null;
const counterIdHtml = document.getElementById("counterId");
const errorHtml = document.getElementById("error");

function showButtonsCounter() {
  document.getElementById("btnUpAppear").innerHTML = "<button id = 'btnUp' class='changeValuebtn'>▲</button>";
  document.getElementById("counterValueApper").innerHTML = "<p id = 'counterValue' class='numberFont'>0</p>";
  document.getElementById("btnDownAppear").innerHTML = "<button id = 'btnDown' class='changeValuebtn'>▼</button>";

  btnUp = document.getElementById("btnUp");
  btnDown = document.getElementById("btnDown");
  counterValue = document.getElementById("counterValue");

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

}

btnCreate.addEventListener("click", e => {
  showButtonsCounter();
  counterValue.innerHTML = 0;
  const payLoad = {
    "method": "create",
    "clientId": clientId
  }

  socket.emit("create", JSON.stringify(payLoad));
})

btnJoin.addEventListener("click", e => {
  showButtonsCounter();
  if(counterId == null) counterId = txtCounterId.value;

  const payLoad = {
    "method": "join",
    "clientId": clientId,
    "counterId": counterId
  }

  socket.emit("join", JSON.stringify(payLoad));
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
  counterValue.innerHTML = response.counter.value;
  console.log("Counter successfully joined with id " + counterId);
  counterIdHtml.innerHTML = "Counter ID: " + counterId;
});

socket.on("updateValue", function(msg) {
  const response = JSON.parse(msg);
  counterValue.innerHTML = response.value;
  console.log("Counter value updated with " + response.value);
});

socket.on("error", function(msg) {
  const response = JSON.parse(msg);
  errorHtml.innerHTML = response.msg;
  setTimeout(function(){ errorHtml.innerHTML = "" }, 2000);
})
