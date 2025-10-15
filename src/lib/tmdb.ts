import type { TmdbMovie, TmdbPaginated } from "@/types/tmdb";

// Base TMDB API config. The API key must be configured in the environment.
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY || "";

/**
 * Minimal wrapper around TMDB REST endpoints with typed responses.
 * Adds language, API key and revalidation hints.
 */
async function tmdbFetch<T>(path: string, query: Record<string, string | number> = {}): Promise<T> {
	const params = new URLSearchParams({
		api_key: TMDB_API_KEY,
		language: "en-US",
		...Object.fromEntries(Object.entries(query).map(([k, v]) => [k, String(v)])),
	});
	const url = `${TMDB_BASE}${path}?${params.toString()}`;
	const res = await fetch(url, { next: { revalidate: 60 } });
	if (!res.ok) throw new Error(`TMDB error ${res.status}`);
	return (await res.json()) as T;
}

/** Fetch a page of popular movies. */
export async function fetchPopularMovies(page: number = 1): Promise<TmdbPaginated<TmdbMovie>> {
	return tmdbFetch<TmdbPaginated<TmdbMovie>>("/movie/popular", { page });
}

/** Search movies by text query. */
export async function searchMovies(query: string, page: number = 1): Promise<TmdbPaginated<TmdbMovie>> {
	return tmdbFetch<TmdbPaginated<TmdbMovie>>("/search/movie", { query, page, include_adult: 0 });
}

/** Fetch full details for a single movie by id. */
export async function fetchMovieDetails(id: string | number): Promise<TmdbMovie> {
	return tmdbFetch<TmdbMovie>(`/movie/${id}`);
}

