const mineflayer = require("mineflayer");
const prep = require("./prepBot");
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });


const mineflayerViewer = require("prismarine-viewer").mineflayer;

let statusBot = false;

wss.on("connection", (ws) => {
  broadcast('statusWss', 'wss 200Ok')
  ws.on("message", (pesan) => {
    const data = JSON.parse(pesan.toString())
    

    switch(data.type) {
      case 'addingBot':
        statusBot = data.message === "true";
        if (statusBot) StartStat();
        break;
      default:
        break;
    }
  });
});

function broadcast(type, message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const dataMT = { type: type, message: message }
      client.send(JSON.stringify(dataMT));
    }
  });
};

const {
  server = "minecraft.serv",
  port = 25565,
  username = "admin",
  version = "default",
} = prep;

function StartStat() {
  const bot = mineflayer.createBot({
    host: server,
    port: port,
    username: username,
    version: version,
  });

  bot.once("spawn", () => {
    mineflayerViewer(bot, { port: 3007, firstPerson: false });
    console.log("bot terspawn");
  });

  bot.on("error", (err) => {
    console.error("error nya = ", err);
    bot.on("end", StartStat);
  });

  bot.on("physicsTick", () => {
    if (!statusBot) {
      bot.quit();
    }
  });

  // logika untuk di berikan ke frontend

  bot.on("messagestr", (messages) => broadcast('statusChat', messages.toString()) );

  bot.on('health', () => {
    broadcast('playerStats', `${bot.username},${bot.health},${bot.food}`)
  })

  // pembatas rules bot
}

/*wss.on("connection", (ws) => {
  ws.on("message", (botOnOf) => {
    const botOnOfStr = botOnOf.toString();
    statusBot = botOnOfStr === "true";
    //statusBot = botOnOfStr === 'false'
    //console.log(botOnOfStr)
    //console.log(`${statusBot}`)
    
  });
  
});*/
