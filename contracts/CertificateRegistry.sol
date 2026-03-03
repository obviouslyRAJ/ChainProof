// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CertificateRegistry
 * @dev enhanced registry for decentralized credential issuance and verification.
 * Supports hybrid hashing: combines structured data (metadata) with file fingerprinting.
 */
contract CertificateRegistry is AccessControl, ReentrancyGuard {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    struct Certificate {
        bytes32 docHash;     // keccak256(abi.encode(name, course, date, fileHash))
        bytes32 fileHash;    // SHA-256 of the certificate file
        string studentName;
        string courseName;
        string issueDate;
        address issuerAddress;
        uint256 timestamp;
        bool exists;
        bool revoked;
    }

    mapping(bytes32 => Certificate) private certificates;

    event CertificateIssued(
        bytes32 indexed docHash, 
        bytes32 indexed fileHash,
        string studentName, 
        string courseName, 
        address indexed issuerAddress
    );
    event CertificateRevoked(bytes32 indexed docHash);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ISSUER_ROLE, admin);
    }

    /**
     * @dev Generate a deterministic hybrid hash for structured data and file fingerprint.
     */
    function generateHash(
        string memory _studentName,
        string memory _courseName,
        string memory _issueDate,
        bytes32 _fileHash
    ) public pure returns (bytes32) {
        return keccak256(abi.encode(_studentName, _courseName, _issueDate, _fileHash));
    }

    /**
     * @dev Issue a new hybrid certificate.
     */
    function issueCertificate(
        string calldata _studentName,
        string calldata _courseName,
        string calldata _issueDate,
        bytes32 _fileHash
    ) external onlyRole(ISSUER_ROLE) {
        bytes32 docHash = generateHash(_studentName, _courseName, _issueDate, _fileHash);
        
        require(!certificates[docHash].exists, "Certificate already exists");
        
        certificates[docHash] = Certificate({
            docHash: docHash,
            fileHash: _fileHash,
            studentName: _studentName,
            courseName: _courseName,
            issueDate: _issueDate,
            issuerAddress: msg.sender,
            timestamp: block.timestamp,
            exists: true,
            revoked: false
        });

        emit CertificateIssued(docHash, _fileHash, _studentName, _courseName, msg.sender);
    }

    /**
     * @dev Revoke a certificate.
     */
    function revokeCertificate(bytes32 _docHash) external onlyRole(ISSUER_ROLE) {
        require(certificates[_docHash].exists, "Certificate does not exist");
        require(!certificates[_docHash].revoked, "Already revoked");
        
        certificates[_docHash].revoked = true;
        emit CertificateRevoked(_docHash);
    }

    /**
     * @dev Verify a certificate by providing its structured data and file hash.
     */
    function verifyCertificate(
        string calldata _studentName,
        string calldata _courseName,
        string calldata _issueDate,
        bytes32 _fileHash
    ) external view returns (
        bool isValid,
        address issuerAddress,
        uint256 timestamp,
        bool isRevoked
    ) {
        bytes32 docHash = generateHash(_studentName, _courseName, _issueDate, _fileHash);
        Certificate memory cert = certificates[docHash];
        
        if (!cert.exists) {
            return (false, address(0), 0, false);
        }
        
        return (true, cert.issuerAddress, cert.timestamp, cert.revoked);
    }

    /**
     * @dev Check if a specific hybrid hash exists in the registry.
     */
    function hashExists(bytes32 _docHash) external view returns (bool) {
        return certificates[_docHash].exists;
    }
}
