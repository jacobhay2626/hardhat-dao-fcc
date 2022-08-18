const { network } = require("hardhat")
const { MIN_DELAY } = require("../helper-hardhat-config")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("-------------------------------------------")
    log("Deploying TimeLock and waiting for confirmations...")

    const timeLock = await deploy("TimeLock", {
        from: deployer,
        args: [MIN_DELAY, [], []],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log(`TimeLock at ${timeLock.address}`)
}

module.exports.tags = ["all", "timelock"]
