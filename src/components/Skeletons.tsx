export function MovieCardSkeleton() {
	return (
		<div className="animate-pulse">
			<div className="bg-gray-200 aspect-[2/3] w-full" />
			<div className="p-2 space-y-2">
				<div className="h-4 bg-gray-200 rounded w-3/4" />
				<div className="h-3 bg-gray-200 rounded w-1/3" />
			</div>
		</div>
	);
}

