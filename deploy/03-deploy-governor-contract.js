const { network, ethers } = require("hardhat")

const QUORUM_PERCENTAGE = 4
const VOTING_PERIOD = 5
const VOTING_DELAY = 1

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const governanceToken = await ethers.getContract("GovernanceToken")
    const timeLock = await ethers.getContract("TimeLock")

    log("-----------------------------------------------------")
    log("Deploying Governor Contract and waiting for confirmations...")

    const governorContract = await deploy("GovernorContract", {
        from: deployer,
        args: [
            governanceToken.address,
            timeLock.address,
            VOTING_DELAY,
            VOTING_PERIOD,
            QUORUM_PERCENTAGE,
        ],
        log: true,
    })

    log(`GovernorContract at ${governorContract.address}`)
}

module.exports.tags = ["all", "governorcontract"]
