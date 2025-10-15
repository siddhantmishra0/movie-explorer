"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

type FavMovie = {
	id: number;
	title: string;
	poster_path: string | null;
	vote_average: number;
};

const IMG_BASE = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE || "https://image.tmdb.org/t/p";

export default function FavoritesPage() {
	const [items, setItems] = useState<FavMovie[]>([]);

	useEffect(() => {
		// Load favorites client-side from localStorage
		try {
			const raw = localStorage.getItem("favorites");
			setItems(raw ? (JSON.parse(raw) as FavMovie[]) : []);
		} catch {
			setItems([]);
		}
	}, []);

	return (
		<div className="py-6">
			<h1 className="text-2xl font-semibold mb-4">My Favorites</h1>
			{items.length === 0 ? (
				<p>No favorites yet.</p>
			) : (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
					{items.map((m) => {
						const poster = m.poster_path ? `${IMG_BASE}/w342${m.poster_path}` : undefined;
						return (
							<a key={m.id} href={`/movie/${m.id}`} className="group block border rounded overflow-hidden hover:shadow">
								<div className="relative aspect-[2/3] bg-gray-100">
									{poster ? (
										<Image src={poster} alt={m.title} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />
									) : (
										<div className="w-full h-full flex items-center justify-center text-sm text-gray-500">No Image</div>
									)}
								</div>
								<div className="p-2">
									<p className="font-medium line-clamp-1">{m.title}</p>
									<p className="text-sm text-gray-600">⭐ {m.vote_average.toFixed(1)}</p>
								</div>
							</a>
						);
					})}
				</div>
			)}
		</div>
	);
}

