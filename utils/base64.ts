
// This utility is provided as per the prompt's guidance for Gemini Live API audio
// but is included here for general utility consistency, though not strictly used
// for code text (which is directly handled as strings).

/**
 * Decodes a Base64 string into a Uint8Array.
 * @param base64 The Base64 encoded string.
 * @returns The decoded Uint8Array.
 */
export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encodes a Uint8Array into a Base64 string.
 * @param bytes The Uint8Array to encode.
 * @returns The Base64 encoded string.
 */
export function encodeBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
