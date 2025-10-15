"use client";
import { useState, useEffect } from "react";

export function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
	const [q, setQ] = useState("");

	useEffect(() => {
		// Debounce search input to avoid spamming API while typing
		const t = setTimeout(() => onSearch(q.trim()), 400);
		return () => clearTimeout(t);
	}, [q, onSearch]);

	return (
		<input
			value={q}
			onChange={(e) => setQ(e.target.value)}
			placeholder="Search movies..."
			className="w-full border rounded px-3 py-2 mb-4"
		/>
	);
}

