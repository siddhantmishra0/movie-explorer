import { NextResponse, NextRequest } from "next/server";
import { verifyAuthToken } from "@/lib/jwt";

// Routes that do not require authentication. Prefix matches are allowed.
const PUBLIC_PATHS: string[] = [
	"/",
	"/_next",
	"/favicon.ico",
	"/login",
	"/register",
	"/favorites",
	"/movie",
	"/api/auth/login",
	"/api/auth/register",
	"/api/auth/logout",
	"/api/auth/me",
	"/api/movies",
];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
    // Allow all public paths and their sub-paths
	const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
	if (isPublic) return NextResponse.next();

	const token = request.cookies.get("auth_token")?.value || "";
	const payload = token ? verifyAuthToken(token) : null;
    // If not authenticated, redirect to register and preserve intended target
    if (!payload) {
        const url = request.nextUrl.clone();
        url.pathname = "/register";
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
    }
	return NextResponse.next();
}

export const config = {
	matcher: ["/(.*)"],
};

