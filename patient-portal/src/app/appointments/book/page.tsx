"use client";

import { useState, useEffect } from "react";
import styles from "../../page.module.css";
import Link from "next/link";
import { API_BASE_URL } from "@/utils/config";

interface Doctor {
    ID: number;
    name: string;
    specialty: string;
    qualification: string;
    experience: number;
    hospitalId: number;
    hospitalName: string;
    consultationFee: number;
    location: string;
    availableDays: string;
    rating: number;
}

interface Hospital {
    ID: number;
    name: string;
    location: string;
    type: string;
    rating: number;
    address: string;
    contactNumber?: string;
    doctors?: Doctor[];
}

export default function BookAppointment() {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState("All");
    const [selectedSpecialty, setSelectedSpecialty] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hospitalsRes, doctorsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/hospitals`),
                    fetch(`${API_BASE_URL}/api/doctors`)
                ]);

                if (hospitalsRes.ok && doctorsRes.ok) {
                    const hospitalsData: Hospital[] = await hospitalsRes.json();
                    const doctorsData: Doctor[] = await doctorsRes.json();

                    // Map doctors to hospitals
                    const hospitalsWithDoctors = hospitalsData.map(h => ({
                        ...h,
                        doctors: doctorsData.filter(d => d.hospitalId === h.ID)
                    }));
                    setHospitals(hospitalsWithDoctors);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Derived filters
    const locations = ["All", ...Array.from(new Set(hospitals.map(h => h.location)))];
    // Get all specialties across all doctors
    const allSpecialties = new Set<string>();
    hospitals.forEach(h => h.doctors?.forEach(d => allSpecialties.add(d.specialty)));
    const specialties = ["All", ...Array.from(allSpecialties)];

    const filteredHospitals = hospitals.filter(hospital => {
        const matchLocation = selectedLocation === "All" || hospital.location === selectedLocation;
        // Check if hospital has ANY doctor with the selected specialty (if filtering by specialty)
        const matchSpecialty = selectedSpecialty === "All" || (hospital.doctors && hospital.doctors.some(d => d.specialty === selectedSpecialty));

        // Search in Hospital Name OR Location OR Doctor Names
        const matchSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hospital.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (hospital.doctors && hospital.doctors.some(d => d.name.toLowerCase().includes(searchTerm.toLowerCase())));

        return matchLocation && matchSpecialty && matchSearch;
    });

    if (loading) return <div className={styles.container}><p>Loading medical directory...</p></div>;

    return (
        <div className={styles.container}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <Link href="/appointments" style={{ padding: '0.5rem', borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                    ←
                </Link>
                <div className={styles.welcome} style={{ margin: 0 }}>
                    <h1>Find a Doctor</h1>
                    <p>Book appointments at top hospitals and clinics in Kerala.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Search Hospital or Doctor</label>
                    <input
                        type="text"
                        placeholder="E.g., Aster, Dr. Harish..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Location</label>
                    <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    >
                        {locations.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Specialty</label>
                    <select
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    >
                        {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Hospital List */}
            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {filteredHospitals.map(hospital => (
                    <div key={hospital.ID} className="glass-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{hospital.name}</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>📍 {hospital.location} • {hospital.type} • ⭐ {hospital.rating}</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>{hospital.address}</p>
                                {hospital.contactNumber && (
                                    <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.25rem', fontWeight: 500 }}>
                                        📞 {hospital.contactNumber}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Inline Doctor List */}
                        <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Available Doctors</h3>
                            {hospital.doctors && hospital.doctors.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                                    {hospital.doctors
                                        .filter(doc => {
                                            const matchSpecialty = selectedSpecialty === "All" || doc.specialty === selectedSpecialty;

                                            // Show doctor if: 
                                            // 1. Hospital itself matched the search (so show all doctors in it)
                                            // 2. OR Doctor's name matches the search
                                            const isHospitalMatch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                hospital.location.toLowerCase().includes(searchTerm.toLowerCase());

                                            const matchSearch = isHospitalMatch || doc.name.toLowerCase().includes(searchTerm.toLowerCase());

                                            return matchSpecialty && matchSearch;
                                        })
                                        .map(doc => (
                                            <div key={doc.ID} style={{
                                                padding: '1rem', border: '1px solid var(--border-subtle)', borderRadius: '8px',
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                background: 'var(--bg-main)'
                                            }}>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{doc.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{doc.specialty} • {doc.experience} Yrs Exp.</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500 }}>₹{doc.consultationFee} Consultation</div>
                                                </div>
                                                <Link href={`/appointments/book/${hospital.ID}/${doc.ID}`}>
                                                    <button className="button-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                                                        Book
                                                    </button>
                                                </Link>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>No doctors found matching filters in this hospital.</p>
                            )}
                        </div>
                    </div>
                ))}

                {filteredHospitals.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        <p>No hospitals found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
