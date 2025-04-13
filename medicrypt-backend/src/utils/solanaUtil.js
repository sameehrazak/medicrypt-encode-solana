import nacl from 'tweetnacl';
import bs58 from 'bs58';

/**
 * Verifies that the provided Base58-encoded signature is valid for the given
 * wallet address and message.
 *
 * @param {string} walletAddress - The Base58-encoded public key.
 * @param {string} signature - The Base58-encoded signature.
 * @param {string} message - The message (challenge) string that was signed.
 * @returns {boolean} - True if the signature is valid; false otherwise.
 */
export function verifySignature(walletAddress, signature, message) {
  try {
    // Decode the wallet address and signature.
    const publicKey = bs58.decode(walletAddress);
    const signatureUint8Array = bs58.decode(signature);

    // Encode the message into a Uint8Array.
    const messageUint8Array = new TextEncoder().encode(message);

    // Verify the signature using tweetnacl.
    return nacl.sign.detached.verify(messageUint8Array, signatureUint8Array, publicKey);
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}
