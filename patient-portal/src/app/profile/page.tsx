"use client";

import { useState, useEffect } from "react";
import styles from "../page.module.css";
import { API_BASE_URL } from "@/utils/config";

export default function Profile() {
    const [profile, setProfile] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/profile`);
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile)
            });
            if (res.ok) {
                setIsEditing(false);
                alert("Profile updated successfully!");
            }
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile.");
        }
    };

    const handleChange = (field: string, value: string) => {
        setProfile((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleEmergencyChange = (field: string, value: string) => {
        // Map logical field names to backend flattened names
        const backendField = field === 'name' ? 'emergencyName'
            : field === 'relationship' ? 'emergencyRelationship'
                : field === 'phone' ? 'emergencyPhone'
                    : field;

        setProfile((prev: any) => ({
            ...prev,
            [backendField]: value
        }));
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('photo', file);

        try {
            const res = await fetch(`${API_BASE_URL}/api/profile/upload`, {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setProfile((prev: any) => ({ ...prev, photoUrl: data.photoUrl }));
                // Dispatch a custom event to notify other components (like Header) about the update
                window.dispatchEvent(new Event('profileUpdated'));
                alert("Photo updated successfully!");
            } else {
                alert("Failed to upload photo.");
            }
        } catch (error) {
            console.error("Error uploading photo:", error);
            alert("Error uploading photo.");
        }
    };

    if (isLoading) return <div className={styles.container}>Loading profile...</div>;
    if (!profile) return <div className={styles.container}>Failed to load profile.</div>;

    return (
        <div className={styles.container}>
            <div className={styles.welcome}>
                <h1>My Profile</h1>
                <p>Personal details and emergency contacts.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
                {/* Left Column: ID Card */}
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>

                    <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem' }}>
                        <input
                            type="file"
                            id="photo-upload"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="photo-upload" style={{ cursor: 'pointer', display: 'block', width: '100%', height: '100%' }}>
                            {profile.photoUrl ? (
                                <img
                                    src={`${API_BASE_URL}${profile.photoUrl}`}
                                    alt="Profile"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '4px solid var(--bg-secondary)'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '100%', height: '100%', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '2.5rem', color: 'white', fontWeight: 700,
                                    border: '4px solid var(--bg-secondary)'
                                }}>
                                    {profile.name?.charAt(0)}
                                </div>
                            )}

                            <div style={{
                                position: 'absolute', bottom: '0', right: '0',
                                background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)',
                                borderRadius: '50%', width: '32px', height: '32px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                    <circle cx="12" cy="13" r="4"></circle>
                                </svg>
                            </div>
                        </label>
                    </div>

                    <h2 style={{ marginBottom: '0.5rem' }}>{profile.name}</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{profile.healthId}</p>

                    <div style={{ textAlign: 'left', background: 'var(--bg-main)', padding: '1rem', borderRadius: '12px' }}>
                        <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Blood Type</span>
                            <span style={{ fontWeight: 600 }}>{profile.bloodType}</span>
                        </div>
                        <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>DOB</span>
                            <span style={{ fontWeight: 600 }}>{profile.dob}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Gender</span>
                            <span style={{ fontWeight: 600 }}>{profile.gender}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Personal Information
                        {isEditing ? (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={() => setIsEditing(false)} style={{ background: 'transparent', border: '1px solid var(--border-subtle)', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={handleSave} className="button-primary" style={{ padding: '0.5rem 1rem' }}>Save</button>
                            </div>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="button-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Edit</button>
                        )}
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Full Name</label>
                            {isEditing ? (
                                <input type="text" value={profile.name} onChange={(e) => handleChange('name', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }} />
                            ) : (
                                <div style={{ fontWeight: 500 }}>{profile.name}</div>
                            )}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Date of Birth</label>
                            {isEditing ? (
                                <input type="date" value={profile.dob} onChange={(e) => handleChange('dob', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }} />
                            ) : (
                                <div style={{ fontWeight: 500 }}>{profile.dob}</div>
                            )}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Gender</label>
                            {isEditing ? (
                                <select value={profile.gender} onChange={(e) => handleChange('gender', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'var(--bg-panel)' }}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            ) : (
                                <div style={{ fontWeight: 500 }}>{profile.gender}</div>
                            )}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Phone Number</label>
                            {isEditing ? (
                                <input type="text" value={profile.phone} onChange={(e) => handleChange('phone', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }} />
                            ) : (
                                <div style={{ fontWeight: 500 }}>{profile.phone}</div>
                            )}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Email Address</label>
                            {isEditing ? (
                                <input type="text" value={profile.email} onChange={(e) => handleChange('email', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }} />
                            ) : (
                                <div style={{ fontWeight: 500 }}>{profile.email}</div>
                            )}
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Home Address</label>
                            {isEditing ? (
                                <input type="text" value={profile.address} onChange={(e) => handleChange('address', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }} />
                            ) : (
                                <div style={{ fontWeight: 500 }}>{profile.address}</div>
                            )}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Aadhar ID</label>
                            {isEditing ? (
                                <input type="text" value={profile.aadharId || ''} onChange={(e) => handleChange('aadharId', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }} />
                            ) : (
                                <div style={{ fontWeight: 500 }}>{profile.aadharId || 'Not set'}</div>
                            )}
                        </div>
                    </div>

                    <h3 style={{ margin: '2rem 0 1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>Medical Details</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Blood Type</label>
                            {isEditing ? (
                                <select value={profile.bloodType} onChange={(e) => handleChange('bloodType', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'var(--bg-panel)' }}>
                                    <option value="">Select Blood Type</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            ) : (
                                <div style={{ fontWeight: 500 }}>{profile.bloodType || 'Not set'}</div>
                            )}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Height (cm)</label>
                            {isEditing ? (
                                <input type="text" value={profile.height || ''} onChange={(e) => handleChange('height', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }} />
                            ) : (
                                <div style={{ fontWeight: 500 }}>{profile.height ? `${profile.height} cm` : 'Not set'}</div>
                            )}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Weight (kg)</label>
                            {isEditing ? (
                                <input type="text" value={profile.weight || ''} onChange={(e) => handleChange('weight', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }} />
                            ) : (
                                <div style={{ fontWeight: 500 }}>{profile.weight ? `${profile.weight} kg` : 'Not set'}</div>
                            )}
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Allergies</label>
                            {isEditing ? (
                                <input type="text" value={profile.allergies || ''} onChange={(e) => handleChange('allergies', e.target.value)} placeholder="e.g. Peanuts, Penicillin" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }} />
                            ) : (
                                <div style={{ fontWeight: 500 }}>{profile.allergies || 'None listed'}</div>
                            )}
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Chronic Conditions</label>
                            {isEditing ? (
                                <input type="text" value={profile.conditions || ''} onChange={(e) => handleChange('conditions', e.target.value)} placeholder="e.g. Diabetes, Hypertension" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }} />
                            ) : (
                                <div style={{ fontWeight: 500 }}>{profile.conditions || 'None listed'}</div>
                            )}
                        </div>
                    </div>

                    <h3 style={{ margin: '2rem 0 1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>Emergency Contact</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Name</label>
                            {isEditing ? (
                                <input type="text" value={profile.emergencyName || ''} onChange={(e) => handleEmergencyChange('name', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }} />
                            ) : (
                                <div style={{ fontWeight: 500 }}>{profile.emergencyName}</div>
                            )}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Relationship</label>
                            {isEditing ? (
                                <input type="text" value={profile.emergencyRelationship || ''} onChange={(e) => handleEmergencyChange('relationship', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }} />
                            ) : (
                                <div style={{ fontWeight: 500 }}>{profile.emergencyRelationship}</div>
                            )}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Phone</label>
                            {isEditing ? (
                                <input type="text" value={profile.emergencyPhone || ''} onChange={(e) => handleEmergencyChange('phone', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }} />
                            ) : (
                                <div style={{ fontWeight: 500 }}>{profile.emergencyPhone}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
