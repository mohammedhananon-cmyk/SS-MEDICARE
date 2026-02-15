"use client";

import { useState, useEffect } from "react";
import styles from "../page.module.css";
import { API_BASE_URL } from "@/utils/config";

export default function HealthRecords() {
    const [records, setRecords] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [recordsRes, appointmentsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/records`),
                fetch(`${API_BASE_URL}/api/appointments`)
            ]);

            let combinedData: any[] = [];

            // 1. Process Health Records
            if (recordsRes.ok) {
                const recordsData = await recordsRes.json();
                combinedData = [...recordsData];
            }

            // 2. Process Appointments
            if (appointmentsRes.ok) {
                const appointmentsData = await appointmentsRes.json();

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const mappedAppointments = appointmentsData.map((appt: any) => {
                    const apptDate = new Date(appt.date);
                    let status = appt.status;

                    // Logic for "Not Done" / "Missed"
                    if (apptDate < today && status !== "Completed" && status !== "Cancelled") {
                        status = "Not Done";
                    }

                    return {
                        id: `appt-${appt.ID}`, // Prefix to avoid collision
                        originalId: appt.ID,
                        date: appt.date,
                        type: `Appointment (${appt.specialty || 'General'})`,
                        doctor: appt.doctorName,
                        facility: appt.facility,
                        status: status,
                        isAppointment: true // Flag to distinguish
                    };
                });

                combinedData = [...combinedData, ...mappedAppointments];
            }

            // 3. Sort by Date (Descending)
            combinedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            setRecords(combinedData);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return (
        <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
            <div className="spinner"></div>
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.welcome}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Health Records</h1>
                        <p>Your complete medical history, visits, and reports.</p>
                    </div>
                    <button className="button-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => alert("Upload Past Record Feature Coming Soon!")}>
                        <span>📤</span> Upload Past Record
                    </button>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Date</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Type</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Doctor</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Facility</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length > 0 ? (
                            records.map((record) => (
                                <tr key={record.id || record.ID} style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                                    <td data-label="Date" style={{ padding: '1rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                        {record.date}
                                        {new Date(record.date) > new Date() && (
                                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary)', marginTop: '2px' }}>Upcoming</span>
                                        )}
                                    </td>
                                    <td data-label="Type" style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '1.2rem' }}>
                                                {record.isAppointment ? '🗓️' : '📄'}
                                            </span>
                                            {record.type}
                                        </div>
                                    </td>
                                    <td data-label="Doctor" style={{ padding: '1rem' }}>{record.doctor}</td>
                                    <td data-label="Facility" style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{record.facility}</td>
                                    <td data-label="Status" style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '99px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background:
                                                record.status === 'Completed' || record.status === 'Normal' ? 'var(--accent-light)' :
                                                    record.status === 'Upcoming' ? 'var(--primary-light)' :
                                                        record.status === 'Not Done' ? 'var(--bg-main)' :
                                                            'rgba(239, 68, 68, 0.1)',
                                            color:
                                                record.status === 'Completed' || record.status === 'Normal' ? 'var(--accent)' :
                                                    record.status === 'Upcoming' ? 'var(--primary)' :
                                                        record.status === 'Not Done' ? 'var(--text-tertiary)' :
                                                            'var(--error)',
                                            border: record.status === 'Not Done' ? '1px solid var(--border-subtle)' : 'none'
                                        }}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td data-label="Action" style={{ padding: '1rem' }}>
                                        {record.isAppointment && record.status === 'Upcoming' ? (
                                            <button className="button-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Reschedule</button>
                                        ) : (
                                            <a href={`/records/${record.originalId || record.ID || record.id}`} className="button-outline" style={{
                                                padding: '0.4rem 0.8rem',
                                                fontSize: '0.8rem',
                                                textDecoration: 'none',
                                                border: '1px solid var(--border-subtle)',
                                                borderRadius: '6px',
                                                color: 'var(--text-primary)',
                                                background: 'var(--bg-secondary)',
                                                display: 'inline-block'
                                            }}>View</a>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
