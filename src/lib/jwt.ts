import jwt from "jsonwebtoken";

import type { AuthTokenPayload } from "@/types/auth";

// Secret used to sign and verify JWTs.
// In production, always provide a strong random value via the JWT_SECRET env var.
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

/**
 * Create a signed JWT for the authenticated user.
 *
 * @param payload - Minimal user identity embedded in the token
 * @param expiresIn - Token expiry window (e.g. "7d", "1h")
 */
export function signAuthToken(payload: AuthTokenPayload, expiresIn: string = "7d"): string {
	return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify a JWT and return its payload or null if invalid/expired.
 */
export function verifyAuthToken(token: string): AuthTokenPayload | null {
	try {
		return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
	} catch {
		return null;
	}
}

