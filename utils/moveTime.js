const { network } = require("hardhat")
const { moveBlocks } = require("./moveBlocks")

async function moveTime(amount) {
    console.log("Moving moveBlocks...")
    await network.provider.send("evm_increaseTime", [amount])

    console.log(`Moved forward in time ${amount} seconds`)
}

module.exports = { moveTime }
