// src/hooks/useAiAnalysis.js
import { useState } from 'react';
import { callAI } from '../lib/api-client';

export const useAiAnalysis = () => {
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeWithAI = async (audioData, spatialData, surfaces, selectedMaterials, apiConfig) => {
    if (!audioData || !spatialData) {
      alert('Please record audio and scan 3D space first!');
      return;
    }

    if (!apiConfig.apiKey) {
      alert('Please configure API key first!');
      return;
    }

    setIsAnalyzing(true);

    try {
      // 🔹 Simulazione della risposta AI (per test)
      const mockAIResponse = {
        dspChain: [
          {
            type: 'eq',
            params: { frequency: 125, gain: -4.2, q: 2.1 },
            description: 'Corrects modal resonance at 125Hz'
          },
          {
            type: 'eq',
            params: { frequency: 250, gain: -2.5, q: 1.8 },
            description: 'Reduces boxy low-mid buildup'
          },
          {
            type: 'hpf',
            params: { frequency: 25, q: 0.5 },
            description: 'Subsonic filter to protect speakers'
          },
          {
            type: 'compressor',
            params: { threshold: -14, ratio: 3, attack: 15, release: 120 },
            description: 'Controls dynamic range'
          },
          {
            type: 'reverb',
            params: { wetLevel: -18, roomSize: 0.4, damping: 0.9 },
            description: 'De-verb: reduces room coloration'
          },
          {
            type: 'delay',
            params: { time: 8.7, feedback: 0.2, mix: 0.35 },
            description: 'Aligns delay speaker'
          }
        ],
        eqCurve: {
          20: 0,
          31.5: -1.5,
          63: -3.0,
          125: -4.2,
          250: -2.5,
          500: -1.0,
          1000: 0.5,
          2000: 1.2,
          3150: 2.0,
          4000: 1.8,
          5000: 1.5,
          6300: 1.0,
          8000: 0.8,
          10000: 0.5,
          12500: 0.3,
          16000: 0.0
        },
        score: 7.8,
        problems: [
          'Strong modal resonance at 125 Hz',
          'Excessive reverb time above 500 Hz',
          'Slight high-frequency absorption imbalance'
        ],
        suggestions: [
          'Use dynamic multiband EQ for adaptive correction',
          'Apply de-esser at 4-8 kHz if sibilance is high',
          'Use de-reverb plugins like SPL De-Verb or Zynaptiq UNVEIL',
          'Implement room correction software (Sonarworks, Dirac Live)',
          'Use multiband compressor for zone-based spectrum control'
        ]
      };

      // 🔹 Stampa la risposta simulata in console
      console.log('🧠 Simulated AI Response:', mockAIResponse);

      // ✅ Simula il parsing JSON (come se fosse arrivato dall'API)
      setAiAnalysis(mockAIResponse);

      // 🔹 Se vuoi testare con l'API reale, decommenta questa parte:
      /*
      const prompt = `Analyze this room acoustics data and provide a DSP chain...`;
      const result = await callAI(prompt, apiConfig);
      console.log('🧠 AI Response from API:', result);
      setAiAnalysis(result);
      */

    } catch (error) {
      console.error('AI analysis failed:', error);
      alert('AI analysis failed: ' + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { aiAnalysis, isAnalyzing, analyzeWithAI };
};