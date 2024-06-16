const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const WebSocket = require("ws");
const ws = new WebSocket("ws://localhost:8080");

let statusChatBot;

try {
  ws.on("message", (jsonMesage) => {
    //console.log(`data: ${message}`)

    const data = JSON.parse(jsonMesage.toString());

    switch (data.type) {
      case "statusChat":
        console.log(data.message);
        statusChatBot = data.message;
        io.emit("message", statusChatBot);
        break;
      case "playerStats":
        const playerData = data.message.split(",");
        io.emit("dataPlayer", playerData);
        break;
      case "statusWss":
        console.log(data.message);
        break;
      default:
        break;
    }
  });

  ws.on("error", (error) => {
    if (error.code === "ECONNREFUSED") {
      console.error("server mineFlayer offline, dalam pengembangan");
    } else {
      console.error("server mineflayer error: ", error);
    }
  });
} catch (err) {
  console.log("websocket di sysCore offline");
}

function sendMessageWss(type, message) {
  const data = { type: type, message: message };
  ws.send(JSON.stringify(data));
}

const db = require("./database/db.js");
const auth = require("./database/auth.js");

app.use(cors());

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  //console.log("my id : ", socket.id);

  socket.on("disconnect", () => {
    //console.log("the id : ", socket.id, " disconnect");
  });
});

app.get("/api/test/get", (req, res) => {
  const data = "core: connected";
  res.send(data);
});

app.post("/api/test/post", (req, res) => {
  const need = req.body
  res.send(`i give you ${need.addBot}`)
});

db.connect();
app.post("/api/register", (req, res) => {
  auth.register(req, res);
});

app.post("/api/login", auth.login);

app.post("/api/dashboard", (req, res) => {
  const { botStatus } = req.body;
  //console.log(`${botStatus}`)
  //ws.on('connection', () => {
  const newBot = botStatus.toString();
  sendMessageWss("addingBot", newBot);
  //})
  /*ws.on('message', (message) => {
        console.log(`status mine: ${message}`)
    })*/
});

app.get("/botapi/statuschat", (req, res) => {
  res.send(statusChatBot);
});

server.listen(3002, () => {
  console.log("server run on");
});

//test mode

// let i = 0;
// async function loop(num) {
//   setTimeout(() => {
//     num+=1;
//     if(num > 20) num = 0
//     console.log(`num ${num}`);
//     io.emit('testInc', (num*5))
//     loop(num);
//   }, 200);
// }
// loop(0);

let statBots;
statBots = {
  id: 1,
  name: "eila",
};
async function loop(num) {
  setTimeout(() => {
    num += 1;
    if (num > 20) num = 0;
    if (num > 19 && statBots.id === 1 ) {
      statBots.id = 2
      statBots.name = 'loli'
    } else if (num > 19 && statBots.id === 2 ) {
      statBots.id = 1
      statBots.name = 'eila'
    }
    statBots.health = num * 5;
    statBots.hunger = num * 2;
    //console.log(`num ${statBots.health}`);
    io.emit("testInc", statBots);
    loop(num);
  }, 200);
}
loop(0);
