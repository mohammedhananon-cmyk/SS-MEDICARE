"use client";

import { useState, useRef, useEffect } from "react";
import styles from "../page.module.css";
import { API_BASE_URL } from "@/utils/config";

export default function Prescriptions() {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [scannedMeds, setScannedMeds] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // For fresh users, start with empty list. In real app, fetch from API.
    const [meds, setMeds] = useState<any[]>([]);

    // Simulating fetching empty or real data
    useEffect(() => {
        // fetchMeds(); 
        // For now, leaving empty to satisfy "fresh user" requirement
    }, []);

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: any) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result?.toString().split(',')[1];
            setIsUploading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/scan-prescription`, {
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
                    if (Array.isArray(parsed)) {
                        setScannedMeds(parsed.map((item: any, idx: number) => ({
                            id: idx,
                            name: item.name || "Unknown",
                            dosage: item.dosage || "-",
                            qty: item.qty || "1",
                            price: item.price || "₹ -"
                        })));

                        // AUTO-SAVE to Health Records
                        const token = localStorage.getItem('token');
                        if (token) {
                            try {
                                await fetch(`${API_BASE_URL}/api/records`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`
                                    },
                                    body: JSON.stringify({
                                        date: new Date().toISOString().split('T')[0],
                                        type: "Prescription Scan",
                                        doctor: "AI Identified",
                                        facility: "Patient Upload",
                                        status: "Active",
                                        details: `Identified ${parsed.length} medicines.`,
                                        attachmentUrl: `data:image/jpeg;base64,${base64String}`
                                    })
                                });
                                console.log("Prescription auto-saved to records.");
                            } catch (err) {
                                console.error("Failed to auto-save record", err);
                            }
                        }

                    } else {
                        // Handle case where AI returns an object instead of array
                        setScannedMeds([{ id: 0, name: "Parsing Error", dosage: "See raw output", qty: "-", price: "-" }]);
                    }
                } catch (e) {
                    console.error("AI Parse Error", e);
                    setScannedMeds([{ id: 0, name: "Could not read prescription", dosage: "Try clearer image", qty: "-", price: "-" }]);
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

    return (
        <div className={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div className={styles.welcome} style={{ marginBottom: 0 }}>
                    <h1>Prescriptions</h1>
                    <p>Track your active medications and refill status.</p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="button-primary"
                    style={{
                        padding: '0.75rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '1rem'
                    }}
                >
                    📸 Upload Prescription
                </button>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {meds.length === 0 ? (
                    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💊</div>
                        <h3>No Active Prescriptions</h3>
                        <p>Upload a prescription to get started.</p>
                    </div>
                ) : (
                    meds.map((med, idx) => (
                        <div key={idx} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: med.status === 'Expired' ? 0.7 : 1 }}>
                            {/* ... Existing med card content ... */}
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                <div style={{
                                    width: '60px', height: '60px', borderRadius: '12px',
                                    background: med.status === 'Active' ? 'var(--accent-light)' : 'var(--bg-main)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: med.status === 'Active' ? 'var(--accent)' : 'var(--text-tertiary)',
                                    fontSize: '1.5rem'
                                }}>
                                    💊
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                                        {med.name} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>{med.dosage}</span>
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{med.freq} • Prescribed by {med.doctor}</p>
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <span style={{
                                        fontWeight: 600,
                                        color: med.status === 'Active' ? 'var(--success)' : 'var(--text-tertiary)'
                                    }}>
                                        {med.status}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary' }}>
                                    {med.refills} refills remaining
                                </div>
                                {med.status === 'Active' && (
                                    <button className="button-primary" style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Request Refill</button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100
                }} onClick={() => setShowUploadModal(false)}>
                    <div
                        className="glass-card"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: '90%', maxWidth: '500px',
                            padding: '2rem',
                            background: 'var(--bg-main)',
                            borderRadius: '16px',
                            maxHeight: '90vh', overflowY: 'auto'
                        }}
                    >
                        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Scan Prescription</h2>

                        {!scannedMeds ? (
                            <>
                                <input
                                    type="file"
                                    hidden
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <div
                                    style={{
                                        border: '2px dashed var(--border-subtle)',
                                        padding: '3rem',
                                        borderRadius: '12px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        handleFileChange({ target: { files: e.dataTransfer.files } });
                                    }}
                                    onClick={triggerUpload}
                                >
                                    {isUploading ? (
                                        <div>
                                            <div className="spinner" style={{ margin: '0 auto 1rem', border: '3px solid var(--border-subtle)', borderTop: '3px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
                                            <p>Scanning handwriting with AI...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                                            <p style={{ fontWeight: 500 }}>Click to Upload or Drag & Drop</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Supports JPG, PNG, PDF</p>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div>
                                <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', color: '#065f46', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    ✅ AI successfully identified {scannedMeds.length} medicines.
                                </div>

                                <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Select Medicines to Order:</h3>
                                <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    {scannedMeds.map((med: any) => (
                                        <label key={med.id} style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '0.75rem', border: '1px solid var(--border-subtle)', borderRadius: '8px', cursor: 'pointer'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <input type="checkbox" defaultChecked />
                                                <div>
                                                    <div style={{ fontWeight: 500 }}>{med.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{med.dosage} • {med.qty}</div>
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: 600 }}>{med.price}</div>
                                        </label>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Estimate</div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹640</div>
                                    </div>
                                    <button className="button-primary" style={{ padding: '0.75rem 1.5rem' }}>
                                        Place Order →
                                    </button>
                                </div>
                                <button onClick={() => setScannedMeds(null)} style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                    Scan Another
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <style jsx>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
