const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    const CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");
    const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
    const contract = await CertificateRegistry.attach(contractAddress);

    console.log("Checking roles for contract:", contractAddress);

    const ISSUER_ROLE = await contract.ISSUER_ROLE();
    console.log("ISSUER_ROLE hash:", ISSUER_ROLE);

    const isIssuer = await contract.hasRole(ISSUER_ROLE, deployer.address);
    console.log(`Address ${deployer.address} is issuer: ${isIssuer}`);

    // Also check public account if user is using it
    const userAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Account #1
    const isUserIssuer = await contract.hasRole(ISSUER_ROLE, userAddress);
    console.log(`Address ${userAddress} is issuer: ${isUserIssuer}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
