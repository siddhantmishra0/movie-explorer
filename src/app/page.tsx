"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MovieCard } from "@/components/MovieCard";
import { SearchBar } from "@/components/SearchBar";
import type { TmdbMovie, TmdbPaginated } from "@/types/tmdb";
import { MovieCardSkeleton } from "@/components/Skeletons";

type State = {
	mode: "popular" | "search";
	query: string;
	page: number;
	items: TmdbMovie[];
	loading: boolean;
	end: boolean;
};

export default function Home() {
	const [state, setState] = useState<State>({ mode: "popular", query: "", page: 1, items: [], loading: true, end: false });

	const endpoint = useMemo(() => {
		// Choose API endpoint based on mode and include pagination/search params
		const base = state.mode === "popular" ? "/api/movies/popular" : "/api/movies/search";
		const params = new URLSearchParams({ page: String(state.page) });
		if (state.mode === "search") params.set("q", state.query);
		return `${base}?${params.toString()}`;
	}, [state.mode, state.page, state.query]);

	useEffect(() => {
		let cancelled = false;
		async function load() {
			setState((s) => ({ ...s, loading: true }));
			let results: TmdbMovie[] = [];
			let totalPages = 1;
			try {
				const res = await fetch(endpoint);
				if (res.ok) {
					const data = (await res.json()) as Partial<TmdbPaginated<TmdbMovie>>;
					results = Array.isArray(data?.results) ? (data!.results as TmdbMovie[]) : [];
					totalPages = typeof data?.total_pages === "number" ? (data!.total_pages as number) : 1;
				}
			} catch {
				results = [];
				totalPages = 1;
			}
			if (cancelled) return;
			setState((s) => ({
				...s,
				items: s.page === 1 ? results : [...s.items, ...results],
				loading: false,
				end: s.page >= (totalPages || 1),
			}));
		}
		load();
		return () => {
			cancelled = true;
		};
	}, [endpoint]);

	const onSearch = useCallback((q: string) => {
		// Reset list and switch modes when search query changes
		setState({ mode: q ? "search" : "popular", query: q, page: 1, items: [], loading: true, end: false });
	}, []);

	const loadMore = useCallback(() => {
		// Append next page when available
		if (!state.loading && !state.end) setState((s) => ({ ...s, page: s.page + 1 }));
	}, [state.loading, state.end]);

	return (
		<div className="py-6">
			<SearchBar onSearch={onSearch} />
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
				{state.loading && state.items.length === 0
					? Array.from({ length: 8 }).map((_, i) => <MovieCardSkeleton key={i} />)
					: state.items.map((m) => <MovieCard key={m.id} movie={m} />)}
			</div>
			<div className="py-6 flex items-center justify-center">
				<button type="button" onClick={loadMore} disabled={state.loading || state.end} className="px-4 py-2 border rounded disabled:opacity-60">
					{state.loading ? "Loading..." : state.end ? "No more" : "Load more"}
				</button>
			</div>
		</div>
	);
}
