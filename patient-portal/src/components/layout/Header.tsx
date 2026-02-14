"use client";

import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { API_BASE_URL } from "@/utils/config";

export default function Header() {
    const [user, setUser] = useState<any>(null);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/profile`);
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            }
        } catch (error) {
            console.error("Failed to fetch user for header", error);
        }
    };

    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // User Profile
        fetchProfile();
        const handleUpdate = () => fetchProfile();
        window.addEventListener('profileUpdated', handleUpdate);

        // Theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);

        return () => window.removeEventListener('profileUpdated', handleUpdate);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (!searchQuery.trim()) return;

            setIsSearching(true);
            setShowResults(true);
            try {
                const res = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(searchQuery)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSearchResults(data || []);
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
                console.error("Search failed", error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }
    };

    // Alerts State
    const [alerts, setAlerts] = useState<any[]>([]);
    const [showAlerts, setShowAlerts] = useState(false);

    useEffect(() => {
        const handleNewAlert = (e: any) => {
            const newAlert = e.detail;
            setAlerts(prev => {
                // Avoid duplicates
                if (prev.some(a => a.message === newAlert.message)) return prev;
                return [newAlert, ...prev];
            });
        };

        window.addEventListener('health-alert', handleNewAlert);
        return () => window.removeEventListener('health-alert', handleNewAlert);
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.searchContainer} style={{ width: '400px', position: 'relative' }}>
                <input
                    type="text"
                    placeholder="Search records, doctors, or hospitals..."
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 2.5rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                        outline: 'none',
                        background: 'white url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Ccircle cx=\'11\' cy=\'11\' r=\'8\'%3E%3C/circle%3E%3Cline x1=\'21\' y1=\'21\' x2=\'16.65\' y2=\'16.65\'%3E%3C/line%3E%3C/svg%3E") no-repeat 10px center'
                    }}
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (e.target.value === '') {
                            setShowResults(false);
                            setSearchResults([]);
                        }
                    }}
                    onKeyDown={handleSearch}
                    onFocus={() => { if (searchResults.length > 0) setShowResults(true); }}
                    onBlur={() => setTimeout(() => setShowResults(false), 200)} // Delay to allow click
                />

                {showResults && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                        zIndex: 50,
                        marginTop: '0.5rem',
                        overflow: 'hidden',
                        border: '1px solid var(--border-subtle)'
                    }}>
                        {isSearching ? (
                            <div style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Searching...</div>
                        ) : searchResults.length > 0 ? (
                            searchResults.map((result, index) => (
                                <div
                                    key={index}
                                    onClick={() => window.location.href = result.link}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        cursor: 'pointer',
                                        borderBottom: index < searchResults.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                                        transition: 'background 0.2s',
                                        display: 'flex', alignItems: 'center', gap: '0.75rem'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-main)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                >
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '6px',
                                        background: 'var(--primary-light)', color: 'var(--primary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.75rem', fontWeight: 600
                                    }}>
                                        {result.category.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>{result.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{result.detail}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'center' }}>No results found.</div>
                        )}
                    </div>
                )}
            </div>

            <div className={styles.actions}>
                <button
                    onClick={toggleTheme}
                    className={styles.iconButton}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-secondary)',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-main)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
                >
                    {theme === 'light' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                    )}
                </button>

                <div
                    className={styles.notification}
                    style={{ position: 'relative', cursor: 'pointer' }}
                    onClick={() => setShowAlerts(!showAlerts)}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    {alerts.length > 0 && <span className={styles.badge} style={{ background: 'var(--error)', width: '8px', height: '8px', position: 'absolute', top: 0, right: 0, borderRadius: '50%' }}></span>}

                    {showAlerts && (
                        <div style={{
                            position: 'absolute',
                            top: '120%',
                            right: 0,
                            width: '320px',
                            background: 'white',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                            zIndex: 100,
                            overflow: 'hidden',
                            animation: 'fadeIn 0.2s ease-out'
                        }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Notifications</span>
                                {alerts.length > 0 && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setAlerts([]); }}
                                        style={{ fontSize: '0.75rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                        Clear All
                                    </button>
                                )}
                            </div>
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {alerts.length > 0 ? (
                                    alerts.map((alert) => (
                                        <div key={alert.id} style={{
                                            padding: '0.75rem 1rem',
                                            borderBottom: '1px solid var(--border-subtle)',
                                            background: alert.type === 'warning' ? '#fffbeb' : 'white',
                                            display: 'flex', gap: '0.75rem', alignItems: 'start'
                                        }}>
                                            <span style={{ fontSize: '1rem', marginTop: '2px' }}>{alert.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                                            <div>
                                                <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>{alert.message}</p>
                                                <small style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Just now</small>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                                        No new notifications
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.user}>
                    <div className={styles.avatar} style={{ overflow: 'hidden', padding: 0 }}>
                        {user?.photoUrl ? (
                            <img
                                src={`${API_BASE_URL}${user.photoUrl}`}
                                alt="Avatar"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            user?.name?.charAt(0) || 'U'
                        )}
                    </div>
                    <div style={{ fontSize: '0.875rem' }}>
                        <p style={{ fontWeight: 600 }}>{user?.name || 'Loading...'}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user?.healthId || '...'}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
