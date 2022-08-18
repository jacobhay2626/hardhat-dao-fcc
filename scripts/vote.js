const fs = require("fs")
const { network } = require("hardhat")
const { proposalsFile } = require("../helper-hardhat-config")

const Index = 0

async function main(proposalIndex) {
    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
}

main(Index)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
