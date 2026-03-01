// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CertificateRegistry
 * @dev Optimized registry for blockchain-based certificate verification.
 */
contract CertificateRegistry is AccessControl, ReentrancyGuard {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    struct Certificate {
        bytes32 docHash;
        string metadataUrl; // IPFS link
        address issuer;
        uint256 timestamp;
        bool isRevoked;
        bool exists;
    }

    mapping(bytes32 => Certificate) private certificates;

    event CertificateIssued(bytes32 indexed docHash, address indexed issuer, string metadataUrl);
    event CertificateRevoked(bytes32 indexed docHash, address indexed revoker);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ISSUER_ROLE, admin);
    }

    /**
     * @dev Issue a new certificate hash.
     * @param _docHash SHA-256 hash of the certificate.
     * @param _metadataUrl URL to metadata on IPFS.
     */
    function issueCertificate(bytes32 _docHash, string calldata _metadataUrl) 
        external 
        onlyRole(ISSUER_ROLE) 
    {
        require(!certificates[_docHash].exists, "Certificate already exists");
        
        certificates[_docHash] = Certificate({
            docHash: _docHash,
            metadataUrl: _metadataUrl,
            issuer: msg.sender,
            timestamp: block.timestamp,
            isRevoked: false,
            exists: true
        });

        emit CertificateIssued(_docHash, msg.sender, _metadataUrl);
    }

    /**
     * @dev Revoke an existing certificate.
     * @param _docHash Hash of the certificate to revoke.
     */
    function revokeCertificate(bytes32 _docHash) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(certificates[_docHash].exists, "Certificate does not exist");
        require(!certificates[_docHash].isRevoked, "Already revoked");

        certificates[_docHash].isRevoked = true;
        emit CertificateRevoked(_docHash, msg.sender);
    }

    /**
     * @dev Verify a certificate hash.
     * @param _docHash Hash to verify.
     * @return isValid Whether the certificate is valid (exists and not revoked).
     * @return metadataUrl The associated metadata URL.
     * @return issuer The address that issued it.
     * @return timestamp The time of issuance.
     */
    function verifyCertificate(bytes32 _docHash) 
        external 
        view 
        returns (bool isValid, string memory metadataUrl, address issuer, uint256 timestamp) 
    {
        Certificate memory cert = certificates[_docHash];
        if (!cert.exists || cert.isRevoked) {
            return (false, "", address(0), 0);
        }
        return (true, cert.metadataUrl, cert.issuer, cert.timestamp);
    }

    /**
     * @dev Check if a hash is registered (regardless of revocation).
     */
    function isRegistered(bytes32 _docHash) external view returns (bool) {
        return certificates[_docHash].exists;
    }
}
