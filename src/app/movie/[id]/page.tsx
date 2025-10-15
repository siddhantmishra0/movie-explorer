import Image from "next/image";
import { fetchMovieDetails } from "@/lib/tmdb";
import type { TmdbMovie } from "@/types/tmdb";

const IMG_BASE = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE || "https://image.tmdb.org/t/p";

// Incremental Static Regeneration: revalidate movie detail page every 5 minutes
export const revalidate = 300;

export default async function MovieDetail({ params }: { params: { id: string } }) {
  const movie: TmdbMovie = await fetchMovieDetails(params.id);
  const poster = movie.poster_path ? `${IMG_BASE}/w500${movie.poster_path}` : undefined;

  return (
    <div className="py-6 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
      <div className="relative w-full aspect-[2/3] bg-gray-100 rounded overflow-hidden">
        {poster ? (
          <Image src={poster} alt={movie.title} fill sizes="(max-width:768px) 80vw, 300px" className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">No Image</div>
        )}
      </div>
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">{movie.title}</h1>
        <div className="text-sm text-gray-600">Rating: ⭐ {movie.vote_average?.toFixed(1)} • Released: {movie.release_date || "—"}</div>
        {movie.overview && <p className="leading-7 text-gray-800 whitespace-pre-line">{movie.overview}</p>}
      </div>
    </div>
  );
}

