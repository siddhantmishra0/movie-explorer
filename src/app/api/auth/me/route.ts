import { NextResponse } from "next/server";

import { verifyAuthToken } from "@/lib/jwt";
import { getUserById } from "@/lib/users";

export async function GET(request: Request) {
	// Parse auth token from cookie header (Next API routes don't expose cookies helper here)
	const cookie = (request.headers.get("cookie") || "").split(";").find((c) => c.trim().startsWith("auth_token="));
	const token = cookie ? cookie.split("=")[1] : "";
	if (!token) {
		return NextResponse.json({ user: null }, { status: 401 });
	}
	const payload = verifyAuthToken(token);
	if (!payload) {
		return NextResponse.json({ user: null }, { status: 401 });
	}
	const user = getUserById(payload.userId);
	return NextResponse.json({ user }, { status: user ? 200 : 404 });
}

