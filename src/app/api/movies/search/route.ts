import { NextResponse } from "next/server";
import { searchMovies } from "@/lib/tmdb";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const q = url.searchParams.get("q") || "";
	const page = Number(url.searchParams.get("page") || "1");
	// Short-circuit empty search queries with an empty result set
	if (!q) return NextResponse.json({ page: 1, results: [], total_pages: 0, total_results: 0 });
	const data = await searchMovies(q, page).catch(() => null);
	if (!data) return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
	return NextResponse.json(data);
}

