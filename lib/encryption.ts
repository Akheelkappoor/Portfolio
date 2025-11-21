import crypto from 'crypto';

// Use a key from environment or generate a default one
// In production, this should be in .env.local
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-secret-key!!';
const ALGORITHM = 'aes-256-cbc';

// Ensure key is 32 bytes
const KEY = Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32));

export function encrypt(text: string): string {
  if (!text) return '';

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Return IV + encrypted data
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(text: string): string {
  if (!text) return '';

  const parts = text.split(':');
  if (parts.length !== 2) return '';

  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = parts[1];

  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);

  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
