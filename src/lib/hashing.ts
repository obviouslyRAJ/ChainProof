import crypto from 'crypto';

/**
 * Generates a SHA-256 hash of a Buffer.
 * @param buffer - The file buffer to hash.
 * @returns The hex string representation of the hash.
 */
export const generateSHA256 = (buffer: Buffer): string => {
    return crypto.createHash('sha256').update(buffer).digest('hex');
};

/**
 * Formats a hex string as a bytes32 for Solidity.
 * @param hex - The hex string to format.
 */
export const toBytes32 = (hex: string): string => {
    return `0x${hex.replace(/^0x/, '')}`;
};
