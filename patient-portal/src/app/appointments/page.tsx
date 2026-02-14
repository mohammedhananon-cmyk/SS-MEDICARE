"use client";

import { useEffect, useState } from "react";
import styles from "../page.module.css";
import Link from "next/link";
import { API_BASE_URL } from "@/utils/config";

export default function Appointments() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/appointments`);
            if (res.ok) {
                const data = await res.json();
                setAppointments(data);
            }
        } catch (error) {
            console.error("Failed to fetch appointments", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className={styles.container}>Loading appointments...</div>;

    return (
        <div className={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div className={styles.welcome} style={{ margin: 0 }}>
                    <h1>Appointments</h1>
                    <p>Manage your upcoming and past visits.</p>
                </div>
                <Link href="/appointments/book">
                    <button className="button-primary">+ Book Appointment</button>
                </Link>
            </div>

            {appointments.length === 0 ? (
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>No appointments found. Book your first one now!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {appointments.map((apt) => (
                        <div key={apt.ID || apt.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>{apt.date}</div>
                                    <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}>{apt.time || "TBD"}</div>
                                </div>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    background: 'var(--primary-light)',
                                    color: 'var(--primary)',
                                    fontWeight: 600
                                }}>
                                    {apt.status}
                                </span>
                            </div>

                            <div style={{ height: '1px', background: 'var(--border-subtle)' }}></div>

                            <div>
                                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{apt.doctorName || apt.doctor}</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{apt.facility}</p>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                <button style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}>Reschedule</button>
                                <button className="button-primary" style={{ flex: 1, padding: '0.5rem' }}>Details</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
