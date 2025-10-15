import { NextResponse } from "next/server";

export async function POST(request: Request) {
    // Clear auth cookie and redirect to login
    const url = new URL("/login", request.url);
    const res = NextResponse.redirect(url);
    res.cookies.set("auth_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
    });
    return res;
}

