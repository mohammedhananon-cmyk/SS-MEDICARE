"use client";

import styles from "./Sidebar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: "My Overview", href: "/" },
        { name: "Health Records", href: "/records" },
        { name: "Appointments", href: "/appointments" },
        { name: "Prescriptions", href: "/prescriptions" },
        { name: "Lab Results", href: "/results" },
        { name: "My Profile", href: "/profile" },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <span>SS</span> MEDICARE
            </div>

            <nav className={styles.nav}>
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`${styles.navItem} ${pathname === item.href ? styles.active : ""}`}
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>

            {/* Logout Section */}
            <div style={{ marginTop: 'auto', paddingBottom: '1rem' }}>
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }}
                    className={styles.navItem}
                    style={{
                        width: '100%',
                        background: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--error)',
                        justifyContent: 'flex-start',
                        marginTop: 'auto'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fef2f2';
                        e.currentTarget.style.borderColor = 'var(--error)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Log Out
                </button>
            </div>

            <div className={styles.footer} style={{ marginTop: 0 }}>
                <p>SS MEDICARE v1.0</p>
                <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>Secure Environment</p>
            </div>
        </aside>
    );
}
