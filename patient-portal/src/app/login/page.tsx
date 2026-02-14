"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import { API_BASE_URL } from "@/utils/config";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

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
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                background: "var(--bg-gradient)",
            }}
        >
            <div className="glass-card" style={{ width: "100%", maxWidth: "400px", padding: "2.5rem" }}>
                <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "var(--primary)" }}>Welcome Back</h2>

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
