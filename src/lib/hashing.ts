import crypto from 'crypto';
import { utils } from 'ethers';

/**
 * Generates a SHA-256 hash of a Buffer.
 */
export const generateSHA256 = (buffer: Buffer): string => {
    return crypto.createHash('sha256').update(buffer).digest('hex');
};

/**
 * Generates a deterministic Keccak256 hash for structured certificate data.
 * Matches Solidity's keccak256(abi.encode(...))
 */
export const generateStructuredHash = (
    studentName: string,
    courseName: string,
    issueDate: string,
    issuerName: string
): string => {
    return utils.keccak256(
        utils.defaultAbiCoder.encode(
            ['string', 'string', 'string', 'string'],
            [studentName, courseName, issueDate, issuerName]
        )
    );
};

/**
 * Formats a hex string as a bytes32 for Solidity.
 */
export const toBytes32 = (hex: string): string => {
    return `0x${hex.replace(/^0x/, '')}`;
};
