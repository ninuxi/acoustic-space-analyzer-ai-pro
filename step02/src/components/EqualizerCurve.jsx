// src/components/EqualizerCurve.jsx
import React from 'react';

export default function EqualizerCurve({ eqSettings }) {
  const freqs = [20, 31.5, 63, 125, 250, 500, 1000, 2000, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000];
  const minDb = -12, maxDb = 12;
  const height = 150;
  const width = 600;

  const points = freqs.map((freq, i) => {
    const x = (i / (freqs.length - 1)) * width;
    const db = eqSettings[freq] || 0;
    const y = height - ((db - minDb) / (maxDb - minDb)) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="eq-curve">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* Grid lines */}
        {[...Array(5)].map((_, i) => (
          <line key={i} x1="0" y1={(i * height) / 4} x2={width} y2={(i * height) / 4} stroke="#333" strokeWidth="0.5" />
        ))}
        {/* Zero line */}
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#666" strokeWidth="1" strokeDasharray="4" />
        {/* EQ Curve */}
        <polyline fill="none" stroke="#00ff88" strokeWidth="3" strokeLinecap="round" points={points} />
      </svg>
    </div>
  );
}