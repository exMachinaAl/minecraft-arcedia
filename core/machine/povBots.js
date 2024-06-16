const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').mineflayer

const povBots = (bot, port) => {

    // bot.once('physicsTick', () => {
        mineflayerViewer(bot, {
            port: port,
            firstPerson: true,
        })
        console.log('suc seed')
    // })


}

module.exports = povBots;