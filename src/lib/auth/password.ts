import bcrypt from "bcrypt";

/**
 * Number of salt rounds for bcrypt hashing.
 * Higher values = more secure but slower.
 * 10 is a good balance for production.
 */
const SALT_ROUNDS = 10;

/**
 * Hashes a plain text password using bcrypt.
 * @param password - The plain text password to hash
 * @returns Promise resolving to the hashed password
 * @throws Error if hashing fails
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password) {
    throw new Error("Password is required for hashing");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
  } catch (error) {
    throw new Error(`Failed to hash password: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Compares a plain text password with a hashed password.
 * @param password - The plain text password to verify
 * @param hash - The hashed password to compare against
 * @returns Promise resolving to true if passwords match, false otherwise
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) {
    return false;
  }

  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    // Log error but don't expose details to caller
    console.error("Password comparison error:", error);
    return false;
  }
}
