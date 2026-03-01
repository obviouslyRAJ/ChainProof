const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    const CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");
    const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
    const contract = await CertificateRegistry.attach(contractAddress);

    const ISSUER_ROLE = await contract.ISSUER_ROLE();
    const userAddress = "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955";

    console.log(`Granting ISSUER_ROLE to user address ${userAddress}...`);
    const tx = await contract.grantRole(ISSUER_ROLE, userAddress);
    await tx.wait();

    const hasRole = await contract.hasRole(ISSUER_ROLE, userAddress);
    console.log(`Success! User address ${userAddress} has ISSUER_ROLE: ${hasRole}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
