import { NextResponse } from "next/server";
import { fetchPopularMovies } from "@/lib/tmdb";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const page = Number(url.searchParams.get("page") || "1");
	const data = await fetchPopularMovies(page).catch(() => null);
	if (!data) return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
	return NextResponse.json(data);
}

