"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter(); // Initialize router
    const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/signup");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            // If on root or protected route and not authenticated
            if (!token && !isAuthPage) {
                router.replace('/login'); // Use replace to avoid history stack issues
                // Do NOT set loading to false, let the redirect happen
            }
            // If on auth page but already authenticated
            else if (token && isAuthPage) {
                router.replace('/');
                setIsAuthenticated(true);
                // Do NOT set loading to false, let the redirect happen
            }
            // Normal state
            else {
                setIsAuthenticated(!!token);
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [pathname, isAuthPage, router]);

    useEffect(() => {
        // Close sidebar on route change
        setIsMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const toggleHandler = () => setIsMobileMenuOpen(prev => !prev);
        window.addEventListener('toggle-sidebar', toggleHandler);
        return () => window.removeEventListener('toggle-sidebar', toggleHandler);
    }, []);

    // Prevent hydration mismatch or flash by showing nothing while checking
    if (isLoading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner" style={{
                border: '3px solid var(--border-subtle)',
                borderTop: '3px solid var(--primary)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 1s linear infinite'
            }}></div>
            <style jsx>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>;
    }

    // If strictly not authenticated and trying to access protected route (and not currently redirecting), don't render content
    if (!isAuthenticated && !isAuthPage) {
        return null;
    }

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
