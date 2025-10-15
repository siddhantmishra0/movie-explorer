import { NextResponse } from "next/server";
import { z } from "zod";

import { createUser } from "@/lib/users";
import { signAuthToken } from "@/lib/jwt";

// Validate shape of registration payload
const RegisterSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(6),
});

export async function POST(req: Request) {
	const json = await req.json().catch(() => null);
	const parsed = RegisterSchema.safeParse(json);
	if (!parsed.success) {
		return NextResponse.json({ error: "Invalid input" }, { status: 400 });
	}
	const { name, email, password } = parsed.data;
	try {
		const user = await createUser(email, password, name);
		const token = signAuthToken({ userId: user.id, email: user.email, name: user.name });
		const res = NextResponse.json({ user });
		res.cookies.set("auth_token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			path: "/",
			maxAge: 60 * 60 * 24 * 7,
		});
		return res;
	} catch (err: any) {
		return NextResponse.json({ error: err?.message || "Registration failed" }, { status: 400 });
	}
}

