export const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export const CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "admin",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "docHash",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "issuer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "metadataUrl",
                "type": "string"
            }
        ],
        "name": "CertificateIssued",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "docHash",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "revoker",
                "type": "address"
            }
        ],
        "name": "CertificateRevoked",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_docHash",
                "type": "bytes32"
            }
        ],
        "name": "isRegistered",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_docHash",
                "type": "bytes32"
            },
            {
                "internalType": "string",
                "name": "_metadataUrl",
                "type": "string"
            }
        ],
        "name": "issueCertificate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_docHash",
                "type": "bytes32"
            }
        ],
        "name": "revokeCertificate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_docHash",
                "type": "bytes32"
            }
        ],
        "name": "verifyCertificate",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isValid",
                "type": "bool"
            },
            {
                "internalType": "string",
                "name": "metadataUrl",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "issuer",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
