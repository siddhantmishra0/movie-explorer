"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);
    try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data?.error || "Registration failed");
			}
            try { localStorage.setItem("last_credentials", JSON.stringify({ email, password })); } catch {}
			router.push("/");
		} catch (err: any) {
			setError(err?.message || "Registration failed");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-[70vh] flex items-center justify-center p-6">
			<form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
				<h1 className="text-2xl font-semibold">Register</h1>
				{error && <p className="text-red-600 text-sm">{error}</p>}
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Name"
					className="w-full border rounded px-3 py-2"
					required
				/>
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
					{loading ? "Creating account..." : "Register"}
				</button>
				<p className="text-sm">
					Have an account? <a className="underline" href="/login">Login</a>
				</p>
			</form>
		</div>
	);
}

