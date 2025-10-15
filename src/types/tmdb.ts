export type TmdbMovie = {
	id: number;
	title: string;
	poster_path: string | null;
	vote_average: number;
	release_date?: string;
	overview?: string;
};

export type TmdbPaginated<T> = {
	page: number;
	results: T[];
	total_pages: number;
	total_results: number;
};

