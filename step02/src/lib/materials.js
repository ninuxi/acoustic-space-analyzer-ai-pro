// src/lib/materials.js
export const MATERIALS = {
  plasterboard: {
    name: 'Plasterboard',
    absorption: { 125: 0.29, 250: 0.10, 500: 0.05, 1000: 0.04, 2000: 0.07, 4000: 0.09 },
    color: '#e0e0e0'
  },
  acoustic_panel: {
    name: 'Acoustic Panel',
    absorption: { 125: 0.20, 250: 0.65, 500: 0.85, 1000: 0.95, 2000: 0.95, 4000: 0.90 },
    color: '#2f4f4f'
  },
  concrete: {
    name: 'Concrete',
    absorption: { 125: 0.01, 250: 0.01, 500: 0.02, 1000: 0.02, 2000: 0.03, 4000: 0.03 },
    color: '#808080'
  }
}