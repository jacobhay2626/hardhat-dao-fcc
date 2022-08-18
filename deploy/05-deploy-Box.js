const { network, ethers } = require("hardhat")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("------------------------------------------------------------")
    log("Deploying Box Contract and waiting for confirmations...")

    const box = await deploy("Box", {
        from: deployer,
        args: [],
        log: true,
    })

    log(`Box at ${box.address}`)

    const boxContract = await ethers.getContractAt("Box", box.address)
    const timeLock = await ethers.getContract("TimeLock")
    const transferTx = await boxContract.transferOwnership(timeLock.address)
    await transferTx.wait(1)
}

module.exports.tags = ["all", "box"]
