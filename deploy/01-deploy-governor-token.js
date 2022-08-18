const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    console.log("-----------------------------------------------")

    console.log("Deploying GovernanceToken and waiting for the confirmation...")

    const governanceToken = await deploy("GovernanceToken", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    console.log(`GovernanceToken at ${governanceToken.address}`)

    await delegate(governanceToken.address, deployer)
    console.log("Delegated!")
}

async function delegate(governanceTokenAddress, delegatedAccount) {
    const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress)
    const Tx = await governanceToken.delegate(delegatedAccount)
    await Tx.wait(1)
    console.log(`Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`)
}

module.exports.tags = ["all", "governortoken", "main"]
