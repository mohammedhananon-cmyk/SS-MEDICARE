"use client";

import { useState, useEffect, useRef } from "react";
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

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [analysisData, setAnalysisData] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: any) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result?.toString().split(',')[1];
            setIsUploading(true);
            try {
                // leveraging the existing lab report scan for general records as it provides generic health analysis
                const response = await fetch(`${API_BASE_URL}/api/scan-lab-report`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imageBase64: base64String })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || "Scan failed");
                }

                const data = await response.json();
                try {
                    const cleanJson = data.analysis.replace(/```json\n?|\n?```/g, '').trim();
                    const parsed = JSON.parse(cleanJson);
                    // Attach the image for saving later
                    parsed.attachmentUrl = `data:image/jpeg;base64,${base64String}`;
                    setAnalysisData(parsed);
                    setShowUploadModal(false);
                } catch (e) {
                    alert("AI could not extract structured data. Please try a clearer image.");
                }
            } catch (error: any) {
                console.error("Upload Error", error);
                alert(`Error: ${error.message}`);
            } finally {
                setIsUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
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
                    <button className="button-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setShowUploadModal(true)}>
                        <span>📤</span> Upload Record
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
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {/* View Button */}
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

                                                {/* AI Analysis Button (Only for records with attachments like uploads) */}
                                                {!record.isAppointment && (
                                                    <button
                                                        onClick={() => {
                                                            setAnalysisData({
                                                                date: record.date,
                                                                test_name: record.type,
                                                                status: record.status,
                                                                interpretation: record.details || "No detailed analysis available.",
                                                                attachmentUrl: record.attachmentUrl,
                                                                isHistorical: true // Flag to hide "Save" button
                                                            });
                                                        }}
                                                        style={{
                                                            padding: '0.4rem 0.8rem',
                                                            fontSize: '0.8rem',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            color: 'white',
                                                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem'
                                                        }}
                                                    >
                                                        ✨ AI
                                                    </button>
                                                )}
                                            </div>
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

            {/* Analysis Result Modal */}
            {analysisData && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100
                }} onClick={() => setAnalysisData(null)}>
                    <div className="glass-card" onClick={(e) => e.stopPropagation()} style={{ width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', background: 'var(--bg-main)', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>Scan Result</h2>
                            <button onClick={() => setAnalysisData(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem' }}>×</button>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
                                <strong>Date:</strong> {analysisData.date}
                            </div>
                            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
                                <strong>Test:</strong> {analysisData.test_name}
                            </div>
                            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
                                <strong>Status:</strong> {analysisData.status}
                            </div>
                            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
                                <strong>Summary:</strong>
                                <p style={{ marginTop: '0.5rem', lineHeight: 1.5 }}>{analysisData.interpretation}</p>
                            </div>

                            {/* Show Image if available (for historical records) */}
                            {analysisData.attachmentUrl && (
                                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
                                    <strong>Original Document:</strong>
                                    <div style={{ marginTop: '0.5rem', maxHeight: '200px', overflow: 'hidden', borderRadius: '8px' }}>
                                        <img src={analysisData.attachmentUrl} alt="Record Attachment" style={{ width: '100%', objectFit: 'cover' }} />
                                    </div>
                                </div>
                            )}

                            {!analysisData.isHistorical && (
                                <button className="button-primary" onClick={async () => {
                                    const token = localStorage.getItem('token');
                                    try {
                                        const res = await fetch(`${API_BASE_URL}/api/records`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${token}`
                                            },
                                            body: JSON.stringify({
                                                date: analysisData.date || new Date().toISOString().split('T')[0],
                                                type: analysisData.test_name || "Health Record",
                                                doctor: "AI Lab Analysis",
                                                facility: "Patient Upload",
                                                status: analysisData.status || "Completed",
                                                details: analysisData.interpretation,
                                                attachmentUrl: analysisData.attachmentUrl
                                            })
                                        });
                                        if (res.ok) {
                                            alert("Record saved successfully!");
                                            setAnalysisData(null);
                                            fetchAllData(); // Refresh list
                                        } else {
                                            alert("Failed to save record.");
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        alert("Error saving record.");
                                    }
                                }}>Save Record</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100
                }} onClick={() => setShowUploadModal(false)}>
                    <div className="glass-card" onClick={(e) => e.stopPropagation()} style={{ width: '90%', maxWidth: '500px', padding: '2rem', background: 'var(--bg-main)', borderRadius: '16px' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Upload Record</h2>
                        <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />
                        <div onClick={triggerUpload} style={{ border: '2px dashed var(--border-subtle)', padding: '3rem', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }}>
                            {isUploading ? (
                                <div className="spinner" style={{ margin: '0 auto', border: '3px solid var(--border-subtle)', borderTop: '3px solid var(--primary)', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }}></div>
                            ) : (
                                <>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                                    <p>Click to Upload or Drag & Drop</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <style jsx>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
