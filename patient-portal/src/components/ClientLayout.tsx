"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === "/login" || pathname === "/signup";

    if (isAuthPage) {
        return <main style={{ minHeight: "100vh" }}>{children}</main>;
    }

    return (
        <div className="layout-wrapper">
            <div className="sidebar-wrapper">
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
