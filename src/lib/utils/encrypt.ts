import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const SALT_LENGTH = 32
const TAG_LENGTH = 16
const KEY_LENGTH = 32

/**
 * Derives an encryption key from the secret using scrypt
 */
function deriveKey(salt: Buffer): Buffer {
  const secret = process.env.ENCRYPTION_SECRET
  if (!secret) {
    throw new Error('ENCRYPTION_SECRET environment variable is not set')
  }
  return scryptSync(secret, salt, KEY_LENGTH)
}

/**
 * Encrypts a string using AES-256-GCM
 * Returns a base64-encoded string containing: salt + iv + authTag + encrypted data
 */
export function encrypt(plaintext: string): string {
  const salt = randomBytes(SALT_LENGTH)
  const iv = randomBytes(IV_LENGTH)
  const key = deriveKey(salt)

  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ])
  const authTag = cipher.getAuthTag()

  // Combine all parts: salt + iv + authTag + encrypted
  const combined = Buffer.concat([salt, iv, authTag, encrypted])
  return combined.toString('base64')
}

/**
 * Decrypts a string that was encrypted with the encrypt function
 * Expects a base64-encoded string containing: salt + iv + authTag + encrypted data
 */
export function decrypt(encryptedData: string): string {
  const combined = Buffer.from(encryptedData, 'base64')

  // Extract parts
  const salt = combined.subarray(0, SALT_LENGTH)
  const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
  const authTag = combined.subarray(
    SALT_LENGTH + IV_LENGTH,
    SALT_LENGTH + IV_LENGTH + TAG_LENGTH
  )
  const encrypted = combined.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH)

  const key = deriveKey(salt)

  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ])

  return decrypted.toString('utf8')
}

/**
 * Safely encrypts a value, returning null if the input is null/undefined
 */
export function encryptIfPresent(value: string | null | undefined): string | null {
  if (!value) return null
  return encrypt(value)
}

/**
 * Safely decrypts a value, returning null if the input is null/undefined
 */
export function decryptIfPresent(value: string | null | undefined): string | null {
  if (!value) return null
  return decrypt(value)
}
