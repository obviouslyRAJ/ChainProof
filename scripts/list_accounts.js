const { ethers } = require("hardhat");

async function main() {
    const accounts = await ethers.getSigners();
    for (let i = 0; i < 3; i++) {
        console.log(`Account #${i}: ${accounts[i].address}`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
