"use client";

import { useEffect, useState, use } from "react";
import styles from "../../page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/utils/config";

export default function RecordDetail({ params }: { params: Promise<{ recordId: string }> }) {
    const { recordId } = use(params);
    const [record, setRecord] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchRecord = async () => {
            try {
                // Ensure recordId is decoded if it contains special chars, though usually IDs are numeric/UUID
                const res = await fetch(`${API_BASE_URL}/api/records/detail?id=${recordId}`);
                if (res.ok) {
                    const data = await res.json();
                    setRecord(data);
                } else {
                    console.error("Failed to fetch record details");
                }
            } catch (error) {
                console.error("Error fetching record:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (recordId) {
            fetchRecord();
        }
    }, [recordId]);

    if (isLoading) return <div className={styles.container}>Loading details...</div>;
    if (!record) return <div className={styles.container}>Record not found.</div>;

    return (
        <div className={styles.container}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/records" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ← Back to Records
                </Link>
            </div>

            <div className="glass-card" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{record.type}</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Record ID: {record.ID}</p>
                    </div>
                    <span style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '99px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        background: record.status === 'Completed' ? 'var(--accent-light)' : '#fee2e2',
                        color: record.status === 'Completed' ? 'var(--accent)' : 'var(--error)'
                    }}>
                        {record.status}
                    </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Date</label>
                        <div style={{ fontWeight: 500, fontSize: '1.1rem' }}>{record.date}</div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Facility</label>
                        <div style={{ fontWeight: 500, fontSize: '1.1rem' }}>{record.facility}</div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Attending Doctor</label>
                        <div style={{ fontWeight: 500, fontSize: '1.1rem' }}>{record.doctor}</div>
                    </div>
                </div>

                <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Clinical Notes / Details</label>
                    <p style={{ lineHeight: 1.6 }}>{record.details || "No additional details provided."}</p>
                </div>

                <div style={{ marginTop: '3rem', textAlign: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        📱 Scan to View Report (PDF)
                    </h3>
                    <div style={{ background: 'white', padding: '1rem', display: 'inline-block', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        {/* Using a reliable public QR API for the prototype */}
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`http://ssmedicare.com/reports/${record.ID}.pdf`)}`}
                            alt="Record QR Code"
                            width={150}
                            height={150}
                            style={{ display: 'block' }}
                        />
                    </div>
                    <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                        Use SS Medicare App to scan and verify authenticity.
                    </p>
                </div>
            </div>
        </div>
    );
}
