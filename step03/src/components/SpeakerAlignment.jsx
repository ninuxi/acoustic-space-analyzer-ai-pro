// src/components/SpeakerAlignment.jsx

import { useState } from 'react';

export default function SpeakerAlignment() {
  const [isAligning, setIsAligning] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const [dxfFile, setDxfFile] = useState(null);
  const [alignmentResults, setAlignmentResults] = useState({});

  const speakers = ['sub', 'mainL', 'mainR', 'frontfill', 'sidefillL', 'sidefillR', 'delay1', 'delay2'];

  const handleDxfUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setDxfFile(file);
      alert(`✅ CAD file "${file.name}" imported. Venue layout loaded.`);
    }
  };

  const startSpeakerAlignment = async () => {
    setIsAligning(true);
    for (const speaker of speakers) {
      setCurrentSpeaker(speaker);
      // Simula il tempo di misurazione
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simula dati FFT, delay e fase
      const fft = Array(8192).fill().map(() => Math.random() * 100);
      const delay = (Math.random() * 10).toFixed(2); // ms
      const phase = (Math.random() * 360).toFixed(1); // degrees

      setAlignmentResults(prev => ({
        ...prev,
        [speaker]: { delay, phase, fft }
      }));

      // Pausa tra una misura e l'altra
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    setIsAligning(false);
    setCurrentSpeaker(null);
    alert("✅ All speakers measured! Ready for AI correction.");
  };

  const applyAICorrections = async () => {
    // Simula risposta AI
    const aiCorrections = {
      corrections: {
        sub: { delay_ms: 1.2, phase_deg: 180, allpass: { frequency: 80, q: 0.7 } },
        mainL: { delay_ms: 0, phase_deg: 0 },
        mainR: { delay_ms: 0.3, phase_deg: 0 },
        frontfill: { delay_ms: 2.1, phase_deg: 90 },
        delay1: { delay_ms: 8.5, phase_deg: 0 }
      },
      summary: "All speakers are time-aligned. Phase coherence optimized with all-pass filters on SUB and FRONTFILL."
    };
    console.log('🧠 AI Speaker Corrections:', aiCorrections);
    alert("✅ AI has applied optimal alignment corrections in real-time.");
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        🔊 Speaker Alignment
      </h3>

      {/* DXF Import */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Import Venue Layout (.dxf)</label>
        <input type="file" accept=".dxf" onChange={handleDxfUpload} className="hidden" id="dxf-upload" />
        <label
          htmlFor="dxf-upload"
          className="block w-full py-2 px-4 bg-gray-700 border border-dashed border-gray-500 rounded cursor-pointer hover:bg-gray-600"
        >
          {dxfFile ? dxfFile.name : "Upload .dxf file"}
        </label>
      </div>

      {/* Start Alignment */}
      <button
        onClick={startSpeakerAlignment}
        disabled={isAligning}
        className="w-full py-2 px-4 bg-gradient-to-r from-orange-600 to-red-600 rounded hover:from-orange-700 hover:to-red-700 disabled:opacity-70"
      >
        {isAligning ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin w-4 h-4 mr-2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
            Measuring {currentSpeaker?.toUpperCase()}...
          </span>
        ) : (
          "Start Speaker Alignment"
        )}
      </button>

      {/* Results */}
      {Object.keys(alignmentResults).length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Alignment Results</h4>
          <ul className="text-sm space-y-1 max-h-40 overflow-y-auto">
            {Object.entries(alignmentResults).map(([sp, res]) => (
              <li key={sp} className="bg-gray-700 p-2 rounded">
                <strong>{sp.toUpperCase()}:</strong> Delay: {res.delay}ms, Phase: {res.phase}°
              </li>
            ))}
          </ul>
          <button
            onClick={applyAICorrections}
            className="w-full mt-3 py-2 px-4 bg-green-600 hover:bg-green-700 rounded"
          >
            Apply AI Corrections
          </button>
        </div>
      )}
    </div>
  );
}