// src/components/RealTimeFFT.jsx
import React from 'react';

export default function RealTimeFFT({ realTimeFFT }) {
  if (!realTimeFFT || realTimeFFT.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg text-center text-gray-400">
        🔇 Waiting for audio...
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg mt-6">
      <h3 className="text-xl font-bold mb-4">📊 Real-Time FFT Analysis</h3>
      <div className="flex space-x-1 h-32">
        {realTimeFFT.map((freqData, i) => {
          const db = freqData.dbSPL;
          const height = Math.max(0, Math.min(100, (db - 60) * 2)); // 60-110 dB → 0-100%
          const color = db < 70 ? 'bg-blue-500' : db < 85 ? 'bg-yellow-500' : 'bg-red-500';
          return (
            <div key={i} className="flex-1 bg-gray-700 rounded-sm overflow-hidden relative">
              <div
                className={`w-full ${color}`}
                style={{ height: `${height}%`, position: 'absolute', bottom: 0, width: '100%' }}
              ></div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        {realTimeFFT.filter((_, i) => i % 3 === 0).map((freqData, i) => {
          const freq = freqData.frequency;
          return (
            <span key={i}>{freq >= 1000 ? `${(freq / 1000).toFixed(1)}k` : freq}Hz</span>
          );
        })}
      </div>
    </div>
  );
}