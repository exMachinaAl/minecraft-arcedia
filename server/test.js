const createBot = require("../core/createBot");
const simsViewer = require("../core/machine/simsViewer");
const povBots = require("../core/machine/povBots");

// require('dotenv').config({ path: require('path').resolve(__dirname, '../.env')})
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const express = require("express");
const { connect } = require("http2");
const net = require("net");
const { resolve } = require("path");
const { throws } = require("assert");
const app = express();

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
  console.log("connect a client");

  socket.on("addBot", (nome) => {
    // console.log(`added bot ${nome}`);
    menambahkanBot(nome);

    setTimeout(() => {
      console.log(`mengirim data bot ke depan`);
      io.emit("infoBot", nome);
    }, 1500);
  });

  socket.on("simsViewer", async (nome) => {
    const port = await availablePort();
    viewAndClick(nome, port);
    socket.emit('portViewerBot', port)
  });

  socket.on("povBot", async (nome) => {
    const port = await availablePort();
    viewPov(nome, port);
    socket.emit('portPovBot', port)
  });
});


function availablePort() {
  let truePort = false;
  let truePortNum = 0;
  while (!truePort) {
    truePortNum = generatePort();

    truePort = new Promise((resolve, reject) => {
      const server = net.createServer();

      server.once("error", (err) => {
        if (err.code === "EADDRINUSE") {
          resolve(false);
        } else {
          reject(err);
        }
      });

      server.once("listening", () => {
        server.close();
        resolve(true);
      });

      server.listen(truePortNum);
    });

    if (truePort) break
  }
  return truePortNum;
}

function generatePort() {
  const min = 10000;
  const max = 50000;
  return Math.floor(Math.random() * (max - min)) + min;
}

let bots = {};

const menambahkanBot = (nameBot) => {
  // adding bots
  const bot = createBot(nameBot);
  console.log(`adding bots ${nameBot}`);

  bot.once("spawn", () => {
    bots[nameBot] = bot;
    console.log(`succes add`);
  });

  try {
    bot.on("error", (e) => {
      console.error("something wrong");
    });
  } catch (econnrefused) {
    console.log('mungkin error pada host atau port yang salah')
  }
};

function viewAndClick(nameBot, port) {
  const bot = bots[nameBot];

  simsViewer(bot, port);

  console.log(`test view on port ${port}`);
};

function viewPov(codeName, port) {
  const bot = bots[codeName];

  povBots(bot, port);
  console.log(`test view on port ${port}`);
};

server.listen(3002, () => {
  console.log("server in 3002");
});

app.get("/test", (req, res) => {
  res.send("hello");
});
