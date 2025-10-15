import { NextResponse } from "next/server";
import { z } from "zod";

import { verifyUser } from "@/lib/users";
import { signAuthToken } from "@/lib/jwt";

// Validate shape of login payload
const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export async function POST(req: Request) {
	const json = await req.json().catch(() => null);
	const parsed = LoginSchema.safeParse(json);
	if (!parsed.success) {
		return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
	}
	const { email, password } = parsed.data;
	const user = await verifyUser(email, password);
	if (!user) {
		return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
	}
	const token = signAuthToken({ userId: user.id, email: user.email, name: user.name });
	const res = NextResponse.json({ user });
	res.cookies.set("auth_token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: 60 * 60 * 24 * 7,
	});
	return res;
}

