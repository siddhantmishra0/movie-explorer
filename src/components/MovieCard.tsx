import Image from "next/image";
import type { TmdbMovie } from "@/types/tmdb";
import { FavoriteButton } from "@/components/FavoriteButton";

const IMG_BASE = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE || "https://image.tmdb.org/t/p";

export function MovieCard({ movie }: { movie: TmdbMovie }) {
	// Prefer poster image when available; fall back to a placeholder tile
	const poster = movie.poster_path ? `${IMG_BASE}/w342${movie.poster_path}` : undefined;
	return (
		<a href={`/movie/${movie.id}`} className="group block border rounded overflow-hidden hover:shadow">
			<div className="relative aspect-[2/3] bg-gray-100">
				{poster ? (
					<Image src={poster} alt={movie.title} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />
				) : (
					<div className="w-full h-full flex items-center justify-center text-sm text-gray-500">No Image</div>
				)}
			</div>
			<div className="p-2 flex items-center justify-between gap-2">
				<div>
					<p className="font-medium line-clamp-1">{movie.title}</p>
					<p className="text-sm text-gray-600">⭐ {movie.vote_average.toFixed(1)}</p>
				</div>
				{/* Local favorites are stored in localStorage; this button toggles membership */}
				<FavoriteButton size="sm" movie={{ id: movie.id, title: movie.title, poster_path: movie.poster_path, vote_average: movie.vote_average }} />
			</div>
		</a>
	);
}

