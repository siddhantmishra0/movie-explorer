"use client";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
	if (typeof document === "undefined") return;
	document.documentElement.dataset.theme = theme;
}

export function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>("light");

	useEffect(() => {
		// Prefer previously chosen theme if available; otherwise use OS preference
		const saved = (typeof localStorage !== "undefined" && (localStorage.getItem("theme") as Theme | null)) || null;
		if (saved) {
			setTheme(saved);
			applyTheme(saved);
			return;
		}
		const prefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
		const initial: Theme = prefersDark ? "dark" : "light";
		setTheme(initial);
		applyTheme(initial);
	}, []);

	function toggle() {
		const next: Theme = theme === "dark" ? "light" : "dark";
		setTheme(next);
		applyTheme(next);
		try { localStorage.setItem("theme", next); } catch {}
	}

	return (
		<button type="button" onClick={toggle} className="px-3 py-1 border rounded text-sm">
			{theme === "dark" ? "Light mode" : "Dark mode"}
		</button>
	);
}

