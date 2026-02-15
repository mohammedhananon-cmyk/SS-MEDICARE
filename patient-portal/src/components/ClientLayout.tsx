"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === "/login" || pathname === "/signup";
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Added state

    useEffect(() => {
        // Close sidebar on route change
        setIsMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const toggleHandler = () => setIsMobileMenuOpen(prev => !prev);
        window.addEventListener('toggle-sidebar', toggleHandler);
        return () => window.removeEventListener('toggle-sidebar', toggleHandler);
    }, []);

    if (isAuthPage) {
        return <main style={{ minHeight: "100vh" }}>{children}</main>;
    }

    return (
        <div className="layout-wrapper">
            {/* Added mobile overlay */}
            <div
                className={`mobile-overlay ${isMobileMenuOpen ? 'visible' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            {/* Applied mobile-open class conditionally */}
            <div className={`sidebar-wrapper ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <Sidebar />
            </div>
            <div className="main-content">
                <Header />
                <main style={{ flex: 1, padding: "1rem 0" }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
