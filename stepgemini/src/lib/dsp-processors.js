// src/lib/dsp-processors.js
export const DSP_PROCESSORS = {
  eq: { name: 'Parametric EQ', params: ['frequency', 'gain', 'q'] },
  hpf: { name: 'High-pass Filter', params: ['frequency', 'q'] },
  compressor: { name: 'Compressor', params: ['threshold', 'ratio', 'attack', 'release', 'knee'] },
  reverb: { name: 'Reverb', params: ['roomSize', 'damping', 'wetLevel', 'dryLevel'] },
  delay: { name: 'Delay', params: ['time', 'feedback', 'mix'] },
  limiter: { name: 'Limiter', params: ['threshold', 'release'] }
};