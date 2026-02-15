"use client";

import { useState, useRef, useEffect } from "react";
import styles from "../page.module.css";
import { API_BASE_URL } from "@/utils/config";

export default function LabResults() {
    const [selectedResult, setSelectedResult] = useState<any>(null);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // For fresh users, start with empty list.
    const [results, setResults] = useState<any[]>([]);

    // In real app, fetch from API. Leaving empty for now.
    useEffect(() => {
    }, []);

    const handleFileUpload = (event: any) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result?.toString().split(',')[1];
            setIsUploading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/scan-lab-report`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imageBase64: base64String })
                });

                if (!response.ok) throw new Error("Scan failed");

                const data = await response.json();
                try {
                    const cleanJson = data.analysis.replace(/```json\n?|\n?```/g, '').trim();
                    const parsed = JSON.parse(cleanJson);

                    // Directly open analysis modal with the new data
                    setSelectedResult({
                        test: parsed.test_name || "Uploaded Report",
                        date: parsed.date || "Unknown Date",
                        status: parsed.status || "Analyzed"
                    });
                    setAnalysisData(parsed);
                    setShowUploadModal(false); // Close upload modal
                } catch (e) {
                    alert("AI could not extract structured data. Please try a clearer image.");
                }
            } catch (error) {
                console.error("Upload Error", error);
                alert("Failed to connect to AI service.");
            } finally {
                setIsUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    const handleAnalyze = async (res: any) => {
        setSelectedResult(res);
        setLoadingAnalysis(true);
        setAnalysisData(null);

        try {
            const response = await fetch('http://localhost:8080/api/analyze-lab-result', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    testName: res.test,
                    status: res.status,
                    date: res.date
                })
            });

            if (!response.ok) throw new Error("Analysis failed");

            const data = await response.json();
            try {
                const cleanJson = data.analysis.replace(/```json\n?|\n?```/g, '').trim();
                const parsed = JSON.parse(cleanJson);
                setAnalysisData(parsed);
            } catch (e) {
                setAnalysisData({
                    interpretation: data.analysis,
                    lifestyle: "Consult Doctor",
                    medications: "Consult Doctor"
                });
            }
        } catch (error) {
            console.error("AI Error:", error);
            setAnalysisData({
                interpretation: "AI Service Unavailable. Please ensure backend is running.",
                lifestyle: "",
                medications: ""
            });
        } finally {
            setLoadingAnalysis(false);
        }
    };

    return (
        <div className={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div className={styles.welcome} style={{ marginBottom: 0 }}>
                    <h1>Lab Results</h1>
                    <p>View and download your laboratory test reports.</p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="button-primary"
                    style={{
                        padding: '0.75rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '1rem',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    📄 Upload Report
                </button>
            </div>

            <div className="glass-card">
                <div className="glass-card">
                    {results.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔬</div>
                            <h3>No Lab Results Found</h3>
                            <p>Upload a lab report to get started.</p>
                        </div>
                    ) : (
                        results.map((res, idx) => (
                            <div key={res.id || idx} style={{
                                padding: '1.5rem',
                                borderBottom: idx !== results.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '1rem'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{res.test}</h3>
                                        {res.status !== 'Normal' && (
                                            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: '#fee2e2', color: '#dc2626', fontWeight: 500 }}>
                                                Attention Needed
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {res.date} • {res.clinic}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '6px',
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        backgroundColor: res.status === 'Normal' ? '#dcfce7' : '#fef3c7',
                                        color: res.status === 'Normal' ? '#166534' : '#92400e'
                                    }}>
                                        {res.status}
                                    </span>

                                    <button
                                        onClick={() => handleAnalyze(res)}
                                        style={{
                                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            fontWeight: 500,
                                            fontSize: '0.875rem'
                                        }}>
                                        ✨ AI Insight
                                    </button>

                                    <button style={{
                                        background: 'transparent',
                                        border: '1px solid var(--border-subtle)',
                                        padding: '0.5rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        ⬇ PDF
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* AI Analysis Modal */}
            {selectedResult && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100
                }} onClick={() => setSelectedResult(null)}>
                    <div
                        className="glass-card"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: '90%', maxWidth: '600px',
                            maxHeight: '90vh', overflowY: 'auto',
                            padding: '2rem',
                            background: 'var(--bg-main)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '16px',
                            animation: 'fadeIn 0.3s ease'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
                                    AI Health Analysis
                                </h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Based on {selectedResult.test} • {selectedResult.date}</p>
                            </div>
                            <button onClick={() => setSelectedResult(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>

                        {loadingAnalysis ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                <div className="spinner" style={{ margin: '0 auto 1rem', border: '3px solid var(--border-subtle)', borderTop: '3px solid var(--primary)', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }}></div>
                                <p>Analyzing biomarkers & clinical correlations...</p>
                            </div>
                        ) : analysisData && (
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid var(--primary)' }}>
                                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        🤖 Interpretation
                                    </h3>
                                    <p style={{ lineHeight: '1.6', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                                        {analysisData.interpretation}
                                    </p>
                                </div>

                                <div>
                                    <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', fontWeight: 600 }}>🥗 Lifestyle Prescription</h3>
                                    <div style={{
                                        background: 'rgba(34, 197, 94, 0.1)', padding: '1rem', borderRadius: '8px', fontSize: '0.95rem', lineHeight: '1.6'
                                    }}>
                                        {typeof analysisData.lifestyle === 'string' ? analysisData.lifestyle : JSON.stringify(analysisData.lifestyle)}
                                    </div>
                                </div>

                                <div>
                                    <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', fontWeight: 600 }}>💊 Suggested Medications</h3>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>
                                        *AI Suggestion only. Requires doctor approval.*
                                    </p>
                                    <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                                        {typeof analysisData.medications === 'string' ? analysisData.medications : JSON.stringify(analysisData.medications)}
                                    </div>
                                </div>

                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                                    ⚠️ Disclaimer: This analysis is generated by AI for informational purposes only. It does not constitute a medical diagnosis. Always consult your healthcare provider before making medical decisions.
                                </div>
                            </div>
                        )}
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
                        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Upload Lab Report</h2>

                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            accept="image/*,application/pdf"
                            onChange={handleFileUpload}
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
                                handleFileUpload({ target: { files: e.dataTransfer.files } });
                            }}
                            onClick={triggerUpload}
                        >
                            {isUploading ? (
                                <div>
                                    <div className="spinner" style={{ margin: '0 auto 1rem', border: '3px solid var(--border-subtle)', borderTop: '3px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
                                    <p>AI is reading your report...</p>
                                </div>
                            ) : (
                                <>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                                    <p style={{ fontWeight: 500 }}>Click to Upload or Drag & Drop</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Full Report (JPG, PNG)</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
