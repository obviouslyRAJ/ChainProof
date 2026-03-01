const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    const CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");
    const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
    const contract = await CertificateRegistry.attach(contractAddress);

    const ISSUER_ROLE = await contract.ISSUER_ROLE();
    const userAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Account #1

    console.log(`Granting ISSUER_ROLE to ${userAddress}...`);
    const tx = await contract.grantRole(ISSUER_ROLE, userAddress);
    await tx.wait();

    console.log("Success! Account #1 now has ISSUER_ROLE.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
