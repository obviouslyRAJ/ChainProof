import hre from "hardhat";

async function main() {
    const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const USER_ADDRESS = "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955";

    const [deployer] = await hre.ethers.getSigners();
    console.log("Using deployer account:", deployer.address);

    const CertificateRegistry = await hre.ethers.getContractAt("CertificateRegistry", CONTRACT_ADDRESS);

    const ISSUER_ROLE = await CertificateRegistry.ISSUER_ROLE();

    console.log(`Granting ISSUER_ROLE to ${USER_ADDRESS}...`);
    const tx = await CertificateRegistry.grantRole(ISSUER_ROLE, USER_ADDRESS);
    await tx.wait();

    console.log("Success! Account authorized.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
