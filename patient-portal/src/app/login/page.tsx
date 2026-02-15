"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import { API_BASE_URL } from "@/utils/config";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token); // Store token
                window.dispatchEvent(new Event("storage")); // Trigger local storage event for any listeners
                router.push("/"); // Redirect to dashboard
            } else {
                setError("Invalid email or password");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                background: "var(--bg-main)",
                position: 'relative'
            }}
        >
            <button
                onClick={toggleTheme}
                style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    boxShadow: 'var(--shadow-sm)'
                }}
            >
                {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>

            <div className="glass-card auth-card">
                <h2 style={{ textAlign: "center", marginBottom: "0.5rem", color: "var(--primary)" }}>Welcome to</h2>
                <h1 style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: '1.5rem', color: "var(--text-primary)" }}>SS MEDICARE</h1>

                {error && (
                    <div style={{ background: '#fee2e2', color: 'var(--error)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                        <label style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.5rem", display: "block" }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={styles.searchInput} // Reusing search input style for now or default input
                            style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border-subtle)", borderRadius: "8px" }}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.5rem", display: "block" }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border-subtle)", borderRadius: "8px" }}
                        />
                    </div>
                    <button type="submit" className="button-primary" style={{ marginTop: "1rem" }}>
                        Login
                    </button>
                </form>
                <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                    Don't have an account? <Link href="/signup" style={{ color: "var(--primary)", fontWeight: 600 }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
}
