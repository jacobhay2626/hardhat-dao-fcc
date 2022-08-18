const { network, ethers } = require("hardhat")
const fs = require("fs")
const {
    NEW_STORE_VALUE,
    FUNC,
    PROPOSAL_DESCRIPTION,
    developmentChains,
    VOTING_DELAY,
    proposalsFile,
    networkConfig,
} = require("../helper-hardhat-config")
const { moveBlocks } = require("../utils/moveBlocks")

async function propose(args, functionToCall, proposalDescription) {
    const governor = await ethers.getContract("GovernorContract")
    const box = await ethers.getContract("Box")
    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args)

    console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`)
    console.log(`Proposal Description: ${proposalDescription}`)

    const proposeTx = await governor.propose(
        [box.address],
        [0],
        [encodedFunctionCall],
        proposalDescription
    )

    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_DELAY + 1)
    }

    const proposeTxReceipt = await proposeTx.wait(1)
    const proposalId = proposeTxReceipt.events[0].args.proposalId
    console.log(`Proposed with proposal ID: ${proposalId}`)

    const proposalState = await governor.state(proposalId)
    const proposalSnapShot = await governor.proposalSnapshot(proposalId)
    const proposalDeadline = await governor.proposalDeadline(proposalId)

    let proposals = JSON.parse(fs.readFileSync("./proposals.json", "utf8"))
    proposals[network.config.chainId].push(proposalId.toString())
    fs.writeFileSync("./proposals.json", JSON.stringify(proposalsArray))

    console.log(`Current Proposal State: ${proposalState}`)

    console.log(`Current Proposal Snapshot: ${proposalSnapShot}`)

    console.log(`Current Proposal Deadline: ${proposalDeadline}`)
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
