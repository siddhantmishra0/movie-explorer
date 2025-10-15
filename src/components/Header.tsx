"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

type User = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
} | null;

export function Header() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    // Re-fetch session on route change to keep header in sync
    async function load() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store", credentials: "include" });
        if (!res.ok) {
          if (!cancelled) setUser(null);
          return;
        }
        const data = (await res.json()) as { user: User };
        if (!cancelled) setUser(data.user ?? null);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [pathname]);

  return (
    <header className="border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold">Movie Explorer</Link>
        <nav className="flex items-center gap-3 text-sm">
          {!loading && user && <span className="text-gray-700">Hello, {user.name}</span>}
          {user && <Link href="/favorites" className="underline">My Favorites</Link>}
          <ThemeToggle />
          {user && (
            <form action="/api/auth/logout" method="POST">
              <button className="px-3 py-1 border rounded" type="submit">Logout</button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}


