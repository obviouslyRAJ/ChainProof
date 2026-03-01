// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CertificateRegistry
 * @dev Optimized registry for blockchain-based structured certificate verification.
 */
contract CertificateRegistry is AccessControl, ReentrancyGuard {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    struct Certificate {
        bytes32 docHash;
        string studentName;
        string courseName;
        string issueDate;
        string issuerName;
        address issuerAddress;
        uint256 timestamp;
        bool exists;
    }

    mapping(bytes32 => Certificate) private certificates;

    event CertificateIssued(
        bytes32 indexed docHash, 
        string studentName, 
        string courseName, 
        address indexed issuerAddress
    );

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ISSUER_ROLE, admin);
    }

    /**
     * @dev Generate a deterministic hash for structured certificate data.
     */
    function generateHash(
        string memory _studentName,
        string memory _courseName,
        string memory _issueDate,
        string memory _issuerName
    ) public pure returns (bytes32) {
        return keccak256(abi.encode(_studentName, _courseName, _issueDate, _issuerName));
    }

    /**
     * @dev Issue a new certificate based on structured data.
     * @param _studentName Name of the student.
     * @param _courseName Name of the course.
     * @param _issueDate Date of issuance.
     * @param _issuerName Name of the issuing entity.
     */
    function issueCertificate(
        string calldata _studentName,
        string calldata _courseName,
        string calldata _issueDate,
        string calldata _issuerName
    ) external onlyRole(ISSUER_ROLE) {
        bytes32 docHash = generateHash(_studentName, _courseName, _issueDate, _issuerName);
        
        require(!certificates[docHash].exists, "Certificate already exists");
        
        certificates[docHash] = Certificate({
            docHash: docHash,
            studentName: _studentName,
            courseName: _courseName,
            issueDate: _issueDate,
            issuerName: _issuerName,
            issuerAddress: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        emit CertificateIssued(docHash, _studentName, _courseName, msg.sender);
    }

    /**
     * @dev Verify a certificate by providing its structured data.
     */
    function verifyCertificate(
        string calldata _studentName,
        string calldata _courseName,
        string calldata _issueDate,
        string calldata _issuerName
    ) external view returns (
        bool isValid,
        address issuerAddress,
        uint256 timestamp
    ) {
        bytes32 docHash = generateHash(_studentName, _courseName, _issueDate, _issuerName);
        Certificate memory cert = certificates[docHash];
        
        if (!cert.exists) {
            return (false, address(0), 0);
        }
        
        return (true, cert.issuerAddress, cert.timestamp);
    }

    /**
     * @dev Check if a specific hash exists in the registry.
     */
    function hashExists(bytes32 _docHash) external view returns (bool) {
        return certificates[_docHash].exists;
    }
}
