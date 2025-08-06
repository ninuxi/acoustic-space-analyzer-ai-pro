// src/components/EqControls.jsx
import { useEffect } from 'react';
import { EQ_FREQUENCIES } from '../lib/equalizer';

export default function EqControls({ eqSettings, setEqSettings, realTimeFFT }) {
  useEffect(() => {
    if (realTimeFFT && realTimeFFT.length > 0) {
      const newEqSettings = {};
      realTimeFFT.forEach(freq => {
        // Invertiamo la deviazione: se il suono è +4dB, taglia di -4dB
        newEqSettings[freq.frequency] = -(freq.deviation);
      });
      setEqSettings(newEqSettings);
    }
  }, [realTimeFFT, setEqSettings]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg mt-6">
      <h3 className="text-xl font-bold mb-4">🎛️ Equalizer (Auto-tuned)</h3>
      <div className="flex items-end justify-between h-32 space-x-1">
        {EQ_FREQUENCIES.map(freq => (
          <div key={freq} className="flex flex-col items-center">
            <input
              type="range"
              min="-12"
              max="12"
              step="0.5"
              value={eqSettings[freq] || 0}
              onChange={(e) =>
                setEqSettings({
                  ...eqSettings,
                  [freq]: parseFloat(e.target.value),
                })
              }
              className="eq-slider"
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: 'center',
                width: '120px',
                marginLeft: '-46px',
                marginRight: '-46px',
              }}
            />
            <div className="text-xs text-gray-400 mt-2 transform -rotate-45 origin-top-left">
              {freq >= 1000 ? `${(freq / 1000).toFixed(1)}k` : freq}
            </div>
            <div
              className={`text-xs mt-1 ${
                eqSettings[freq] > 0
                  ? 'text-green-400'
                  : eqSettings[freq] < 0
                  ? 'text-red-400'
                  : 'text-gray-400'
              }`}
            >
              {eqSettings[freq] > 0 ? '+' : ''}
              {eqSettings[freq]}dB
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}