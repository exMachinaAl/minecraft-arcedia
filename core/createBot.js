const mineflayer = require('mineflayer');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env')})

const createBot = (names) => {
    const bot = mineflayer.createBot({
        host: process.env.HOST_MINEFLAYER,
        port: process.env.PORT_MINEFLAYER,
        username: names,
        version: '1.20.1',
    })
    return bot
}

module.exports = createBot;