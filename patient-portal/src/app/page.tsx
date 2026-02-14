"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { API_BASE_URL } from "@/utils/config";

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'Upcoming appointment with Dr. Sarah tomorrow at 10:00 AM.' },
    { id: 2, type: 'info', message: 'New lab results from City Lab Corp are available.' },
  ]);

  // Vitals State
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [vitals, setVitals] = useState({
    bp: "120/80",
    hr: 72,
    spo2: 98
  });
  const [lastUpdated, setLastUpdated] = useState("Just now");

  // Trend State
  const [trendRange, setTrendRange] = useState('Real-Time');
  const [bpTrend, setBpTrend] = useState<any[]>([]);

  useEffect(() => {
    // Initialize trend based on default range
    updateHistoricalData('Real-Time');
  }, []);

  useEffect(() => {
    updateHistoricalData(trendRange);
  }, [trendRange]);

  const updateHistoricalData = (range: string) => {
    let data = [];
    const now = new Date();

    if (range === 'Real-Time') {
      // Reset to initial real-time state
      data = [
        { label: '10:00', sys: 118, dia: 78 },
        { label: '10:30', sys: 122, dia: 80 },
        { label: '11:00', sys: 119, dia: 79 },
        { label: '11:30', sys: 125, dia: 82 },
        { label: '12:00', sys: 121, dia: 78 },
        { label: '12:30', sys: 123, dia: 81 },
        { label: '13:00', sys: 120, dia: 80 },
      ];
    } else if (range === 'Past Week') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        data.push({
          label: d.toLocaleDateString([], { weekday: 'short' }),
          sys: 115 + Math.floor(Math.random() * 15),
          dia: 75 + Math.floor(Math.random() * 10)
        });
      }
    } else if (range === 'Past Month') {
      for (let i = 3; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - (i * 7));
        data.push({
          label: `Week ${4 - i}`,
          sys: 118 + Math.floor(Math.random() * 10),
          dia: 78 + Math.floor(Math.random() * 8)
        });
      }
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
    if (trendRange !== 'Real-Time') return; // Only update live if in Real-Time mode

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
      return;
    }

    setIsConnecting(true);
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      setIsDeviceConnected(true);
      triggerAlert('info', 'SmartWatch Ultra connected successfully.');
    }, 2500);
  };

  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const stats = [
    { title: "Next Appointment", value: "Feb 14", change: "Dr. Sarah (Cardiology)", type: "primary" },
    { title: "Latest Lab Result", value: "Normal", change: "Blood Panel (Yesterday)", type: "success" },
    { title: "Prescriptions", value: "3 Active", change: "Refill in 5 days", type: "warning" },
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
              <span className={styles.dot}></span>
              <div>
                <p><strong>Appointment Confirmed</strong></p>
                <small>Updated 2 hours ago • Dr. Sarah</small>
              </div>
            </li>
            <li>
              <span className={styles.dot} style={{ background: 'var(--success)' }}></span>
              <div>
                <p><strong>Lab Results Available</strong></p>
                <small>Yesterday • General Blood Panel</small>
              </div>
            </li>
            <li>
              <span className={styles.dot} style={{ background: 'var(--warning)' }}></span>
              <div>
                <p><strong>Prescription Refilled</strong></p>
                <small>3 days ago • Lisinopril 10mg</small>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
