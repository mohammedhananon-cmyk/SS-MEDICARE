"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { API_BASE_URL } from "@/utils/config";

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  // Initial alerts (Can be populated from backend later)
  const [alerts, setAlerts] = useState<any[]>([]);

  // Vitals State
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [vitals, setVitals] = useState({
    bp: "--/--",
    hr: 0,
    spo2: 0
  });
  const [lastUpdated, setLastUpdated] = useState("Never");

  // Trend State
  const [trendRange, setTrendRange] = useState('Real-Time');
  const [bpTrend, setBpTrend] = useState<any[]>([]);

  useEffect(() => {
    // Reset state first
    setProfile(null);

    // Initialize trend based on default range with empty data for new users
    updateHistoricalData('Real-Time');

    const fetchProfile = () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Fetch Profile
        fetch(`${API_BASE_URL}/api/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(res => {
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
          })
          .then(data => setProfile(data))
          .catch(err => {
            console.error("Failed to load profile", err);
          });
      }
    };

    fetchProfile();

    const handleProfileUpdate = () => fetchProfile();
    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  useEffect(() => {
    updateHistoricalData(trendRange);
  }, [trendRange]);

  const updateHistoricalData = (range: string) => {
    // For a new user, we start with empty or placeholder trends until device connects
    if (!isDeviceConnected && range === 'Real-Time') {
      setBpTrend(Array(7).fill({ label: '--:--', sys: 0, dia: 0 }));
      return;
    }

    // ... (Simulation logic can remain for demo purposes if connected, but let's keep it simple for now)
    // If we want "fresh", let's just show empty until they connect.
    let data = [];
    const now = new Date();

    if (range === 'Real-Time') {
      data = [
        { label: '10:00', sys: 0, dia: 0 },
        { label: '10:30', sys: 0, dia: 0 },
        { label: '11:00', sys: 0, dia: 0 },
        { label: '11:30', sys: 0, dia: 0 },
        { label: '12:00', sys: 0, dia: 0 },
        { label: '12:30', sys: 0, dia: 0 },
        { label: '13:00', sys: 0, dia: 0 },
      ];
    } else {
      // Just empty placeholders
      for (let i = 0; i < 7; i++) data.push({ label: 'Day ' + (i + 1), sys: 0, dia: 0 });
    }
    setBpTrend(data);
  };

  // ... (keep existing useEffects) ...

  const triggerAlert = (type: string, message: string) => {
    // Dispatch event for Header to catch
    const newAlert = { id: Date.now(), type, message };
    window.dispatchEvent(new CustomEvent('health-alert', { detail: newAlert }));

    // Opt: Keep local state if needed for other logic, but remove UI rendering
    setAlerts(prev => {
      if (prev.some(a => a.message === message)) return prev;
      return [newAlert, ...prev];
    });
  };

  const updateTrend = () => {
    if (trendRange !== 'Real-Time' || !isDeviceConnected) return; // Only update live if in Real-Time mode AND connected

    const now = new Date();
    const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newSys = parseInt(vitals.bp.split('/')[0]) || 120;
    const newDia = parseInt(vitals.bp.split('/')[1]) || 80;

    setBpTrend(prev => {
      // Keep only last 7 points for real-time
      const newTrend = [...prev.slice(1), { label: timeLabel, sys: newSys, dia: newDia }];
      return newTrend;
    });
  };

  const initiateConnection = () => {
    if (isDeviceConnected) {
      setIsDeviceConnected(false);
      setVitals({ bp: "--/--", hr: 0, spo2: 0 }); // Reset on disconnect
      setLastUpdated("Never");
      return;
    }

    setIsConnecting(true);
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      setIsDeviceConnected(true);
      // Simulate reading
      setVitals({ bp: "120/80", hr: 72, spo2: 98 });
      setLastUpdated("Just now");
      triggerAlert('info', 'SmartWatch Ultra connected successfully.');
    }, 2500);
  };

  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const stats = [
    { title: "Next Appointment", value: "No Appts", change: "Schedule Now", type: "neutral" },
    { title: "Latest Lab Result", value: "--", change: "No records found", type: "neutral" },
    { title: "Prescriptions", value: "0 Active", change: "No active meds", type: "neutral" },
  ];

  return (
    <div className={styles.container}>
      {/* ... Welcome Section ... */}
      <div className={styles.welcome} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <h1>Hello, {profile?.name || 'Patient'}</h1>
          <p>Your personal health dashboard is up to date.</p>
        </div>
        <button
          onClick={initiateConnection}
          disabled={isConnecting}
          className={isDeviceConnected ? "button-secondary" : "button-primary"}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            border: isDeviceConnected ? '1px solid var(--success)' : 'none',
            color: isDeviceConnected ? 'var(--success)' : 'white',
            opacity: isConnecting ? 0.7 : 1,
            cursor: isConnecting ? 'wait' : 'pointer'
          }}
        >
          {isConnecting ? (
            <>
              <span className="spinner" style={{ width: '12px', height: '12px', border: '2px solid white', borderTop: '2px solid transparent' }}></span>
              Connecting...
            </>
          ) : isDeviceConnected ? (
            <>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }}></span>
              Device Connected
            </>
          ) : (
            <>
              Connect Smart Device
            </>
          )}
        </button>
      </div>



      {/* ... Stats Grid ... */}
      <div className={styles.statsGrid}>
        {/* ... (keep stats grid content) ... */}
        <div className={`glass-card ${styles.statCard}`} style={{ border: isDeviceConnected ? '1px solid var(--accent-light)' : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <h3>Live Vitals</h3>
            {isDeviceConnected && <span style={{ fontSize: '0.75rem', color: 'var(--accent)', background: 'var(--accent-light)', padding: '2px 6px', borderRadius: '4px' }}>LIVE</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>BP</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{vitals.bp}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>HR</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{vitals.hr} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>bpm</span></div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>SpO2</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{vitals.spo2}%</div>
            </div>
          </div>

          <div className={`${styles.change} ${styles.neutral}`} style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
            {isDeviceConnected ? `Updated: ${lastUpdated}` : 'Connect device to view'}
          </div>
        </div>

        {stats.map((stat, index) => (
          <div key={index} className={`glass-card ${styles.statCard}`}>
            <h3>{stat.title}</h3>
            <div className={styles.value} style={{ fontSize: stat.value.length > 8 ? '1.5rem' : '2.5rem' }}>
              {stat.value}
            </div>
            <div className={`${styles.change} ${styles[stat.type] || styles.neutral}`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.contentGrid}>
        <div className={`glass-card ${styles.chartSection}`}>
          <div className={styles.cardHeader}>
            <h2>Health Trends (Blood Pressure)</h2>
            <select
              className={styles.select}
              value={trendRange}
              onChange={(e) => setTrendRange(e.target.value)}
            >
              <option value="Real-Time">Real-Time (Last 7)</option>
              <option value="Past Week">Past Week</option>
              <option value="Past Month">Past Month</option>
            </select>
          </div>
          <div className={styles.chartPlaceholder} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', paddingBottom: '20px' }}>
            {bpTrend.map((point, i) => {
              // Calculate height: Base min-height of 4px so 0 values are visible as flat lines
              const heightPercent = Math.max((point.sys / 160) * 100, 4);
              const isActive = isDeviceConnected && i === bpTrend.length - 1;

              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                  <div
                    className={styles.bar}
                    title={`${point.sys}/${point.dia} at ${point.label}`}
                    style={{
                      height: `${heightPercent}%`,
                      width: '100%',
                      maxWidth: '40px',
                      // Only override background if active, otherwise let CSS gradient show
                      background: isActive ? 'var(--accent)' : undefined,
                      transition: 'height 0.5s ease',
                      opacity: isActive ? 1 : 0.7
                    }}
                  ></div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>{point.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`glass-card ${styles.activitySection}`}>
          <h2>Recent Activity</h2>
          <ul className={styles.activityList}>
            <li>
              <span className={styles.dot} style={{ background: 'var(--primary)' }}></span>
              <div>
                <p><strong>Account Created</strong></p>
                <small>Welcome to SS MEDICARE</small>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
