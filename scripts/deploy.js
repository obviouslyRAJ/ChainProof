import hre from "hardhat";

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");
    const registry = await CertificateRegistry.deploy(deployer.address);

    await registry.deployed();

    console.log("CertificateRegistry deployed to:", await registry.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
