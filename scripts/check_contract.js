import { ethers } from 'ethers';
import * as fs from 'fs';

const CONTRACT_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

async function check() {
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
    try {
        const code = await provider.getCode(CONTRACT_ADDRESS);
        console.log("Contract code length:", code.length);
        if (code === "0x") {
            console.error("No contract found at this address!");
        } else {
            console.log("Contract found!");
        }

        const blockNumber = await provider.getBlockNumber();
        console.log("Current block number:", blockNumber);
    } catch (e) {
        console.error("RPC Error:", e);
    }
}

check();
