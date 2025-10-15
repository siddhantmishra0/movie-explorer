import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

import type { PublicUser } from "@/types/auth";

type StoredUser = PublicUser & { passwordHash: string };

// NOTE: In-memory store for demo purposes only. Replace with a real database in production.
const users: Map<string, StoredUser> = new Map();

/**
 * Create a new user record and return the public view.
 * Throws if the email is already registered.
 */
export async function createUser(email: string, password: string, name: string): Promise<PublicUser> {
	const exists = Array.from(users.values()).find((u) => u.email.toLowerCase() === email.toLowerCase());
	if (exists) {
		throw new Error("User already exists");
	}
	const passwordHash = await bcrypt.hash(password, 10);
	const user: StoredUser = {
		id: randomUUID(),
		email,
		name,
		createdAt: new Date().toISOString(),
		passwordHash,
	};
	users.set(user.id, user);
	return toPublic(user);
}

/** Verify credentials and return the public user, or null if invalid. */
export async function verifyUser(email: string, password: string): Promise<PublicUser | null> {
	const found = Array.from(users.values()).find((u) => u.email.toLowerCase() === email.toLowerCase());
	if (!found) return null;
    // Reference passwordHash to satisfy unused var lint in some strict settings
    void found.passwordHash;
    const ok = await bcrypt.compare(password, found.passwordHash);
	return ok ? toPublic(found) : null;
}

/** Lookup a user by id and return the public view. */
export function getUserById(userId: string): PublicUser | null {
	const u = users.get(userId);
	return u ? toPublic(u) : null;
}

function toPublic(u: StoredUser): PublicUser {
	const { passwordHash, ...pub } = u;
	return pub;
}

