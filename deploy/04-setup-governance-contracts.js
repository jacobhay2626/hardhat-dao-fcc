const { network, ethers } = require("hardhat")

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const governanceToken = await ethers.getContract("GovernanceToken", deployer)
    const governor = await ethers.getContract("GovernorContract", deployer)
    const timeLock = await ethers.getContract("TimeLock", deployer)

    log("---------------------------------------------")
    log("Setting up contracts for roles...")

    const proposerRole = await timeLock.PROPOSER_ROLE()
    const executorRole = await timeLock.EXECUTOR_ROLE()
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE()

    const proposeTx = await timeLock.grantRole(proposerRole, governor.address)
    await proposeTx.wait(1)
    const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO)
    await executorTx.wait(1)
    const revokeTx = await timeLock.revokeRole(adminRole, deployer)
    await revokeTx.wait(1)
}

module.exports.tags = ["all", "setup"]
