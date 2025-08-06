// File: src/components/analysis/AnalysisResults.jsx

import React from 'react';
import { DSP_PROCESSORS } from '../../constants/dsp-processors.js';
import { BrainIcon } from '../ui/Icons.jsx';
import ExportControls from './ExportControls.jsx';

const AnalysisResults = ({ analysisResults, dspChain, audioData, roomModel }) => {

    if (!analysisResults) {
        return (
            <div className="card bg-white border border-gray-200">
                <div className="card-body text-center py-16">
                    <div className="text-4xl mb-4">📊</div>
                    <h3 className="text-2xl font-bold text-gray-700">No Analysis Results</h3>
                    <p className="text-gray-600 mt-2">Please run the AI analysis on the previous tab to see the results here.</p>
                </div>
            </div>
        );
    }

    // --- INIZIO CODICE CORRETTO ---
    // Estraiamo i dati dell'analisi audio DALL'OGGETTO analysisResults, non più da audioData
    const audioAnalysis = analysisResults.aiAnalysis.analysis || {}; 
    const { roomData, aiAnalysis } = analysisResults;
    // --- FINE CODICE CORRETTO ---

    const Metric = ({ label, value, unit = '', icon }) => (
        <div className="text-center p-4 bg-gray-50 rounded-lg border">
            <div className="text-sm text-gray-500 mb-1 flex items-center justify-center">
                <span className="mr-2">{icon}</span>{label}
            </div>
            <div className="text-2xl font-bold text-purple-600">{value}{unit}</div>
        </div>
    );

    const DSPChain = () => (
        <div className="space-y-4">
            {dspChain.map((processor, index) => {
                const dspInfo = DSP_PROCESSORS[processor.type];
                if (!dspInfo) return null;
                return (
                    <div key={index} className="p-4 rounded-lg flex items-start space-x-4" style={{ backgroundColor: `${dspInfo.color}20` }}>
                        <div className="text-3xl mt-1" style={{ color: dspInfo.color }}>{dspInfo.icon}</div>
                        <div className="flex-grow">
                            <h5 className="font-bold text-lg">{`${index + 1}. ${dspInfo.name}`}</h5>
                            <p className="text-sm text-gray-700">{processor.reasoning || dspInfo.description}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold gradient-text mb-2">Analysis Results Dashboard</h2>
                <p className="text-gray-600 text-lg">{`Analysis completed on ${new Date(analysisResults.timestamp).toLocaleString()}`}</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Metric label="Room Volume" value={roomData.volume.toFixed(1)} unit="m³" icon="🏠" />
                <Metric label="Avg. RT60" value={roomData.avgRT60.toFixed(2)} unit="s" icon="⌛" />
                {/* Usiamo i dati corretti da audioAnalysis */}
                <Metric label="Dynamic Range" value={(audioAnalysis.peakLevel - audioAnalysis.rmsLevel).toFixed(1)} unit="dB" icon="📊" />
                <Metric label="DSP Processors" value={dspChain.length} icon="🎚️" />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="card bg-white border border-gray-200">
                    <div className="card-header"><h3 className="text-xl font-semibold flex items-center"><BrainIcon size={24} className="mr-2" />AI Analysis Summary</h3></div>
                    <div className="card-body space-y-4">
                        <div>
                            <h4 className="font-semibold mb-1">Overall Reasoning:</h4>
                            <p className="text-gray-700">{aiAnalysis.reasoning}</p>
                        </div>
                        {aiAnalysis.recommendations?.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-1">Additional Recommendations:</h4>
                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                    {aiAnalysis.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                                </ul>
                            </div>
                        )}
                        <div className="text-sm text-gray-500 text-right">{`AI Confidence: ${(aiAnalysis.confidence * 100).toFixed(0)}%`}</div>
                    </div>
                </div>
                <div className="card bg-white border border-gray-200">
                    <div className="card-header"><h3 className="text-xl font-semibold flex items-center"><span className="text-xl mr-2">🛰️</span>Final DSP Chain</h3></div>
                    <div className="card-body"><DSPChain /></div>
                </div>
            </div>

            <div className="card bg-white border border-gray-200">
                <div className="card-header"><h3 className="text-xl font-semibold">Data Recap & Export</h3></div>
                <div className="card-body">
                    <ExportControls {...{ analysisResults, dspChain, audioData, roomModel }} />
                </div>
            </div>
        </div>
    );
};

export default AnalysisResults;