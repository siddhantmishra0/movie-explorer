"use client";
import { useEffect, useMemo, useState } from "react";

type FavMovie = {
	id: number;
	title: string;
	poster_path: string | null;
	vote_average: number;
};

function readFavorites(): FavMovie[] {
	// Read favorites from localStorage; return empty list on SSR or parse errors
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem("favorites");
		return raw ? (JSON.parse(raw) as FavMovie[]) : [];
	} catch {
		return [];
	}
}

function writeFavorites(favs: FavMovie[]) {
	try {
		localStorage.setItem("favorites", JSON.stringify(favs));
	} catch {}
}

export function FavoriteButton({ movie, size = "md" }: { movie: FavMovie; size?: "sm" | "md" }) {
	const [favorites, setFavorites] = useState<FavMovie[]>([]);
	const isFav = useMemo(() => favorites.some((m) => m.id === movie.id), [favorites, movie.id]);

	useEffect(() => {
		// Hydrate favorites on first client render
		setFavorites(readFavorites());
	}, []);

	function toggle() {
		setFavorites((prev) => {
			const next = prev.some((m) => m.id === movie.id)
				? prev.filter((m) => m.id !== movie.id)
				: [...prev, movie];
			writeFavorites(next);
			return next;
		});
	}

	const className = size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm";

	return (
		<button
			type="button"
			onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}
			aria-pressed={isFav}
			className={`rounded border ${className} ${isFav ? "bg-yellow-400 border-yellow-500" : "bg-white/80 border-gray-300"}`}
		>
			{isFav ? "★ Favorited" : "☆ Favorite"}
		</button>
	);
}

