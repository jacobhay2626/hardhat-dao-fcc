const { ethers } = require("hardhat")

const networkConfig = {
    4: {
        name: "rinkeby",
        vrfCoordinatorV2: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
        entranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        subcriptionId: "9005",
        callbackGasLimit: "500000",
        interval: "30",
    },
    31337: {
        name: "hardhat",
        entranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        callbackGasLimit: "500000",
        interval: "30",
    },
}

const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6
const frontEndContractsFile = "../nextjs-smartcontract-lottery-fcc/constants/contractAddresses.json"
const frontEndAbiFile = "../nextjs-smartcontract-lottery-fcc/constants/abi.json"
const NEW_STORE_VALUE = 77
const FUNC = "store"
const PROPOSAL_DESCRIPTION = "Proposal 1: Store 77 in the Box Contract"
const QUORUM_PERCENTAGE = 4
const VOTING_PERIOD = 5
const VOTING_DELAY = 1
const proposalsFile = "proposals.json"
const MIN_DELAY = 3600

module.exports = {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    frontEndContractsFile,
    frontEndAbiFile,
    NEW_STORE_VALUE,
    FUNC,
    PROPOSAL_DESCRIPTION,
    QUORUM_PERCENTAGE,
    VOTING_PERIOD,
    VOTING_DELAY,
    proposalsFile,
    MIN_DELAY,
}
