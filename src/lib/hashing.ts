import crypto from 'crypto';

/**
 * Generates a SHA-256 hash of a Buffer.
 * This is primarily used for server-side or test-side hashing.
 */
export const generateSHA256 = (buffer: Buffer): string => {
    return crypto.createHash('sha256').update(buffer).digest('hex');
};

/**
 * Formats a hex string as a bytes32 for Solidity.
 */
export const toBytes32 = (hex: string): string => {
    return `0x${hex.replace(/^0x/, '')}`;
};
