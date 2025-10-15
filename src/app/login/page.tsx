"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";


function LoginForm() {
	const router = useRouter();
	const search = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Prefill with last used credentials for demo convenience
        try {
            const raw = localStorage.getItem("last_credentials");
            if (raw) {
                const c = JSON.parse(raw) as { email?: string; password?: string };
                if (c.email) setEmail(c.email);
                if (c.password) setPassword(c.password);
            }
        } catch {}
    }, []);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data?.error || "Login failed");
			}
            try { localStorage.setItem("last_credentials", JSON.stringify({ email, password })); } catch {}
			const next = search.get("next") || "/";
			router.push(next);
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : "Login failed";
			setError(message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-[70vh] flex items-center justify-center p-6">
			<form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
				<h1 className="text-2xl font-semibold">Login</h1>
				{error && <p className="text-red-600 text-sm">{error}</p>}
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					className="w-full border rounded px-3 py-2"
					required
				/>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					className="w-full border rounded px-3 py-2"
					required
				/>
				<button disabled={loading} className="w-full bg-black text-white py-2 rounded disabled:opacity-60">
					{loading ? "Logging in..." : "Login"}
				</button>
				<p className="text-sm">
					No account? <a className="underline" href="/register">Register</a>
				</p>
			</form>
		</div>
	);
}

export default function LoginPage() {
	return (
		<Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center p-6">Loading...</div>}>
			<LoginForm />
		</Suspense>
	);
}

