"use client";

import { useState, useEffect, use } from "react";
import styles from "../../../../page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
}

export default function BookingConfirmation({ params }: { params: Promise<{ hospitalId: string; doctorId: string }> }) {
    const unwrappedParams = use(params);
    const router = useRouter();
    const [hospital, setHospital] = useState<Hospital | null>(null);
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [isConfirmed, setIsConfirmed] = useState(false);

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

                    const foundHospital = hospitalsData.find(h => h.ID.toString() === unwrappedParams.hospitalId);
                    const foundDoctor = doctorsData.find(d => d.ID.toString() === unwrappedParams.doctorId);

                    setHospital(foundHospital || null);
                    setDoctor(foundDoctor || null);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [unwrappedParams.hospitalId, unwrappedParams.doctorId]);

    if (loading) return <div className={styles.container}>Loading details...</div>;

    if (!hospital || !doctor) {
        return <div className={styles.container}>Doctor or Hospital not found.</div>;
    }

    const availableSlots = [
        "09:00 AM", "10:30 AM", "11:45 AM", "02:00 PM", "03:30 PM", "04:45 PM"
    ];

    const handleConfirm = async () => {
        if (!hospital || !doctor) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/appointments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: 1, // Mock User ID
                    date: selectedDate,
                    time: selectedTime,
                    hospitalId: hospital.ID.toString(),
                    doctorId: doctor.ID.toString(),
                    doctorName: doctor.name,
                    specialty: doctor.specialty,
                    facility: hospital.name
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Appointment booked:", result);
                setIsConfirmed(true);
                setTimeout(() => {
                    router.push("/appointments");
                }, 3000);
            } else {
                console.error("Failed to book appointment");
                alert("Failed to book appointment. Please try again.");
            }
        } catch (error) {
            console.error("Error booking appointment:", error);
            alert("An error occurred. Please make sure the backend is running.");
        }
    };

    if (isConfirmed) {
        return (
            <div className={styles.container} style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%', background: 'var(--success)', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', marginBottom: '1.5rem',
                    boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)'
                }}>
                    ✓
                </div>
                <h1 style={{ marginBottom: '1rem' }}>Booking Confirmed!</h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '2rem' }}>
                    Your appointment with <strong>{doctor.name}</strong> at <strong>{hospital.name}</strong> has been successfully scheduled for <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong>.
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>Redirecting to appointments...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Link href="/appointments/book" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                ← Back to Search
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>

                {/* Summary Card */}
                <div className="glass-card" style={{ padding: '2rem', height: 'fit-content' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                        Appointment Summary
                    </h2>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Doctor</label>
                        <div style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.25rem' }}>{doctor.name}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{doctor.specialty} • {doctor.experience} Yrs Exp.</div>
                        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>{doctor.qualification}</div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hospital</label>
                        <div style={{ fontSize: '1rem', fontWeight: 500, marginTop: '0.25rem' }}>{hospital.name}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{hospital.address}, {hospital.location}</div>
                    </div>

                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Consultation Fee</span>
                            <span style={{ fontWeight: 600 }}>₹ {doctor.consultationFee}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Booking Charge</span>
                            <span style={{ fontWeight: 600 }}>₹ 50</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '1.1rem', fontWeight: 700 }}>
                            <span>Total</span>
                            <span style={{ color: 'var(--primary)' }}>₹ {doctor.consultationFee + 50}</span>
                        </div>
                    </div>
                </div>

                {/* Date & Time Selection */}
                <div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Select Slot</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Choose your preferred date and time for the consultation.</p>

                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 500 }}>Select Date</label>
                            <input
                                type="date"
                                className={styles.input}
                                style={{
                                    width: '100%', padding: '1rem', borderRadius: '8px',
                                    border: '1px solid var(--border-subtle)', outline: 'none',
                                    fontFamily: 'inherit', fontSize: '1rem', background: 'var(--bg-main)', color: 'var(--text-primary)'
                                }}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 500 }}>Available Time Slots</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem' }}>
                                {availableSlots.map(slot => (
                                    <button
                                        key={slot}
                                        onClick={() => setSelectedTime(slot)}
                                        style={{
                                            padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)',
                                            background: selectedTime === slot ? 'var(--primary)' : 'var(--bg-main)',
                                            color: selectedTime === slot ? 'white' : 'var(--text-primary)',
                                            cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            className="button-primary"
                            style={{ width: '100%', padding: '1rem', opacity: (!selectedDate || !selectedTime) ? 0.5 : 1 }}
                            disabled={!selectedDate || !selectedTime}
                            onClick={handleConfirm}
                        >
                            Confirm Appointment
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
