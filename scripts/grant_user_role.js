const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    const CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const contract = await CertificateRegistry.attach(contractAddress);

    const ISSUER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ISSUER_ROLE"));
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
