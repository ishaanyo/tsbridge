'use client';
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [signals, setSignals] = useState([]);
  const [orders, setOrders] = useState([]);
  const lastOrderCount = useRef(0);
  const audioCtx = useRef(null);

  const playBeep = () => {
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtx.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  const fetchData = async () => {
    try {
      const [sigRes, ordRes] = await Promise.all([
        fetch('/api/signals'),
        fetch('/api/orders')
      ]);
      if (sigRes.ok) setSignals(await sigRes.json());
      if (ordRes.ok) {
        const newOrders = await ordRes.json();
        if (newOrders.length > lastOrderCount.current) {
          playBeep();
        }
        lastOrderCount.current = newOrders.length;
        setOrders(newOrders);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ color: '#58a6ff', marginBottom: '10px' }}>TSBridge — Options Trading Monitor</h1>
      <p style={{ color: '#8b949e', marginBottom: '30px' }}>Realtime signals & orders (read-only). New orders play a sound.</p>

      <h2 style={{ color: '#3fb950' }}>Recent Orders</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
        <thead>
          <tr style={{ background: '#161b22' }}>
            <th style={th}>ID</th><th style={th}>Symbol</th><th style={th}>Action</th><th style={th}>Price</th><th style={th}>Time</th><th style={th}>Order ID</th><th style={th}>Created</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} style={{ background: o.action === 'BUY' ? '#0d2818' : '#28180d' }}>
              <td style={td}>{o.id}</td>
              <td style={td}>{o.symbol}</td>
              <td style={{...td, color: o.action === 'BUY' ? '#3fb950' : '#f85149', fontWeight: 'bold'}}>{o.action}</td>
              <td style={td}>{o.price}</td>
              <td style={td}>{o.time}</td>
              <td style={td}>{o.order_id || '—'}</td>
              <td style={td}>{new Date(o.created_at).toLocaleTimeString()}</td>
            </tr>
          ))}
          {orders.length === 0 && <tr><td colSpan="7" style={{...td, textAlign: 'center', color: '#8b949e'}}>No orders yet</td></tr>}
        </tbody>
      </table>

      <h2 style={{ color: '#d29922' }}>Recent Signals</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#161b22' }}>
            <th style={th}>ID</th><th style={th}>Symbol</th><th style={th}>Side</th><th style={th}>K Type</th><th style={th}>Date</th><th style={th}>Time</th><th style={th}>Price</th><th style={th}>Created</th>
          </tr>
        </thead>
        <tbody>
          {signals.map(s => (
            <tr key={s.id}>
              <td style={td}>{s.id}</td>
              <td style={td}>{s.symbol}</td>
              <td style={{...td, color: s.side === 'BUY' ? '#3fb950' : '#f85149'}}>{s.side}</td>
              <td style={td}>{s.k_type}</td>
              <td style={td}>{s.date}</td>
              <td style={td}>{s.time}</td>
              <td style={td}>{s.price}</td>
              <td style={td}>{new Date(s.created_at).toLocaleTimeString()}</td>
            </tr>
          ))}
          {signals.length === 0 && <tr><td colSpan="8" style={{...td, textAlign: 'center', color: '#8b949e'}}>No signals yet</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

const th = { padding: '10px', textAlign: 'left', borderBottom: '1px solid #30363d', color: '#e6edf3' };
const td = { padding: '8px', borderBottom: '1px solid #21262d' };
