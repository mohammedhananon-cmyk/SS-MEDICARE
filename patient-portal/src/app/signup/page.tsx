"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import { API_BASE_URL } from "@/utils/config";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const signupRes = await fetch(`${API_BASE_URL}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (signupRes.status === 201) { // 201 Created
                // Automatically login
                const loginRes = await fetch(`${API_BASE_URL}/api/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                if (loginRes.ok) {
                    const data = await loginRes.json();

                    // Clear any potential old data first
                    localStorage.removeItem("token");

                    // Set new token
                    localStorage.setItem("token", data.token);

                    // Force storage event for other tabs/components
                    window.dispatchEvent(new Event("storage"));

                    // Small delay to ensure ClientLayout picks up the token change
                    setTimeout(() => {
                        router.push("/");
                    }, 100);
                } else {
                    router.push("/login"); // Fallback if auto-login fails
                }
            } else {
                setError("Failed to create account. User may already exist.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
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
            <div className="glass-card auth-card">
                <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "var(--primary)" }}>Create Account</h2>

                {error && (
                    <div style={{ background: '#fee2e2', color: 'var(--error)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                        <label style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.5rem", display: "block" }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={styles.searchInput}
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
                    <div>
                        <label style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.5rem", display: "block" }}>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border-subtle)", borderRadius: "8px" }}
                        />
                    </div>
                    <button type="submit" className="button-primary" style={{ marginTop: "1rem" }}>
                        Create Account
                    </button>
                </form>
                <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                    Already have an account? <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Log in</Link>
                </p>
            </div>
        </div>
    );
}
