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

            <div className={styles.footer}>
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        marginBottom: '1rem',
                        textAlign: 'left',
                        padding: 0
                    }}
                >
                    Log Out
                </button>
                <p>SS MEDICARE v1.0</p>
                <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>Secure Environment</p>
            </div>
        </aside>
    );
}
