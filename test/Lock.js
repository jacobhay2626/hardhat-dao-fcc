const { network, deployments, ethers } = require("hardhat")
const { moveTime } = require("../utils/moveTime")
const { moveBlocks } = require("../utils/moveBlocks")
const { assert } = require("chai")
const fs = require("fs")
const {
    developmentChains,
    NEW_STORE_VALUE,
    FUNC,
    PROPOSAL_DESCRIPTION,
    proposalsFile,
    VOTING_PERIOD,
    VOTING_DELAY,
    MIN_DELAY,
} = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Test for DAO", () => {
          beforeEach(async () => {
              await deployments.fixture("all")
              box = await ethers.getContract("Box")
              token = await ethers.getContract("GovernanceToken")
              governor = await ethers.getContract("GovernorContract")
              timeLock = await ethers.getContract("TimeLock")
          })

          it("Should allow us to change the value on the Box contract", async () => {
              console.log("Step 1...")
              console.log("Proposing...")
              const encodedFunctionCall = await box.interface.encodeFunctionData(FUNC, [
                  NEW_STORE_VALUE,
              ])
              console.log(`Proposing ${FUNC} on ${box.address} for ${NEW_STORE_VALUE}`)

              const proposeTx = await governor.propose(
                  [box.address],
                  [0],
                  [encodedFunctionCall],
                  PROPOSAL_DESCRIPTION
              )

              if (developmentChains.includes(network.name)) {
                  await moveBlocks(VOTING_DELAY + 1)
              }

              const proposeTxReceipt = await proposeTx.wait(1)
              const proposalId = proposeTxReceipt.events[0].args.proposalId

              let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
              proposals[network.config.chainId.toString()].push(proposalId.toString())

              fs.writeFileSync(proposalsFile, JSON.stringify(proposals))

              const proposalState = await governor.state(proposalId)
              const proposalSnapShot = await governor.proposalSnapshot(proposalId)
              const proposalDeadline = await governor.proposalDeadline(proposalId)

              console.log(`Current Proposal State: ${proposalState}`)

              console.log(`Current Proposal Snapshot: ${proposalSnapShot}`)

              console.log(`Current Proposal Deadline: ${proposalDeadline}`)

              console.log("Step 2...")
              console.log("Voting...")

              proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf-8"))
              const proposal = proposals[network.config.chainId.toString()][0]
              const Vote = 1
              const reason = "I like the number :)"
              const VoteTx = await governor.castVoteWithReason(proposal, Vote, reason)

              const VoteTxReceipt = await VoteTx.wait(1)
              const returnedReason = VoteTxReceipt.events[0].args.reason
              console.log(returnedReason)
              const state = await governor.state(proposal)

              console.log(`Proposal State: ${state}`)

              if (developmentChains.includes(network.name)) {
                  await moveBlocks(VOTING_PERIOD + 1)
              }

              console.log("Step 3 and 4...")
              console.log("Queueing...")
              const descriptionHash = ethers.utils.keccak256(
                  ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION)
              )
              const queueTx = await governor.queue(
                  [box.address],
                  [0],
                  [encodedFunctionCall],
                  descriptionHash
              )

              await queueTx.wait(1)

              if (developmentChains.includes(network.name)) {
                  await moveTime(MIN_DELAY + 1)
                  await moveBlocks(1)
              }

              console.log("executing...")

              const executeTx = await governor.execute(
                  [box.address],
                  [0],
                  [encodedFunctionCall],
                  descriptionHash
              )

              await executeTx.wait(1)
              const boxNewValue = await box.retrieve()
              console.log(`Box new value: ${boxNewValue.toString()}`)
              assert.equal(boxNewValue.toString(), "77")
          })
      })

// 1. Need to call the propose function on the Governor contract which
// will allow you to get the proposalId from the transaction receipt. You can then add the proposalId to the array
// in proposals.json.
// 2. Voting: Need to call the castVoteWithReason function on governor. Requires a proposal (proposal.json), Vote and reason.
// Then need to use the vote receipt to get the reason and then call the state function on the governor contract which takes
// the proposal.
// 3. Queueing: need to get the description Hash then use that to call the queue function on governor.
// 4. Executing: Call execute on governor, then call getValue function on box and ensure the new value is equal to one chosen.
