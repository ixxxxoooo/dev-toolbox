// Polyfill for crypto.getRandomValues in Node.js < 17.4.0
const crypto = require('crypto');

console.log('[Crypto Polyfill] Loading crypto polyfill for Node.js', process.version);

// Patch crypto module directly (for Vite's internal use)
if (!crypto.getRandomValues) {
  crypto.getRandomValues = function(buffer) {
    const bytes = crypto.randomBytes(buffer.byteLength || buffer.length);
    if (buffer.set) {
      buffer.set(bytes);
    } else {
      for (let i = 0; i < bytes.length; i++) {
        buffer[i] = bytes[i];
      }
    }
    return buffer;
  };
  console.log('[Crypto Polyfill] crypto.getRandomValues added to crypto module');
}

// Also patch globalThis for browser-like environments
if (!globalThis.crypto) {
  globalThis.crypto = {};
}

if (!globalThis.crypto.getRandomValues) {
  globalThis.crypto.getRandomValues = crypto.getRandomValues;
  console.log('[Crypto Polyfill] crypto.getRandomValues added to globalThis.crypto');
}

if (!globalThis.crypto.randomUUID) {
  // Simple UUID v4 generator for Node.js < 15.6.0
  globalThis.crypto.randomUUID = function() {
    const bytes = crypto.randomBytes(16);
    // Set version (4) and variant bits
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    // Convert to hex string with dashes
    const hex = bytes.toString('hex');
    return [
      hex.substring(0, 8),
      hex.substring(8, 12),
      hex.substring(12, 16),
      hex.substring(16, 20),
      hex.substring(20, 32)
    ].join('-');
  };
  console.log('[Crypto Polyfill] crypto.randomUUID added to globalThis.crypto');
}

console.log('[Crypto Polyfill] Polyfill loaded successfully');
