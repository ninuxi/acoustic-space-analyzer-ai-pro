// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

<style>
  :root {
    --bg: #0a0a0a;
    --card-bg: #1a1a1a;
    --text: #e0e0e0;
    --accent: #00ff88; /* Verde neon (tipo REW) */
    --ai: #ff2a6d; /* Rosa acceso per AI */
    --eq-blue: #00aaff;
    --eq-red: #ff3860;
    --border: #333;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Inter', 'Segoe UI', sans-serif;
    margin: 0;
    padding: 0;
  }

  .card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(8px);
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--accent);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .fft-visualization {
    height: 150px;
    display: flex;
    gap: 1px;
    overflow-x: auto;
    padding: 0.5rem 0;
  }

  .fft-bar {
    flex: 1;
    background: var(--eq-blue);
    border-radius: 4px 4px 0 0;
    position: relative;
  }

  .fft-bar::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(to top, rgba(0, 255, 136, 0.3), transparent);
    border-radius: 4px 4px 0 0;
  }

  .eq-curve {
    height: 150px;
    background: #121212;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    margin-top: 1rem;
  }

  .eq-curve-line {
    position: absolute;
    bottom: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background: #444;
  }

  .eq-curve-path {
    fill: none;
    stroke: var(--accent);
    stroke-width: 3;
    stroke-linecap: round;
  }
</style>