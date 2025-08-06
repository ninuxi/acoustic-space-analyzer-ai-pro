// File: src/components/analysis/AIAnalyzer.jsx

import React from 'react';
import { DSP_PROCESSORS, DSPUtils } from '../../constants/dsp-processors.js';
import { BrainIcon, LoadingSpinner, AlertTriangleIcon, InfoIcon, CheckIcon, XIcon } from '../ui/Icons.jsx';

const AIAnalyzer = ({ audioData, roomModel, apiConfig, onGenerateChain, isAnalyzing, dspChain }) => {
    const canAnalyze = audioData && roomModel && apiConfig.apiKey;

    const DSPChainDisplay = () => {
        if (dspChain.length === 0) {
            return <p className="text-gray-600">The generated DSP chain will appear here.</p>;
        }

        return (
            <div className="space-y-3">
                {dspChain.map((processor, index) => {
                    const dspInfo = DSP_PROCESSORS[processor.type];
                    if (!dspInfo) return null;

                    const paramsString = Object.entries(processor.params)
                        .map(([key, value]) => {
                            const paramDef = dspInfo.params[key];
                            return `${key}: ${DSPUtils.formatParameterValue(value, paramDef?.unit)}`;
                        })
                        .join(', ');

                    return (
                        <div
                            key={index}
                            className="p-4 rounded-lg flex items-start space-x-4 animate-fade-in"
                            style={{ 
                                backgroundColor: `${dspInfo.color}20`,
                                borderColor: `${dspInfo.color}80`,
                                borderLeftWidth: '4px',
                                animationDelay: `${index * 100}ms`
                            }}
                        >
                            <div className="text-3xl flex-shrink-0 mt-1" style={{ color: dspInfo.color }}>
                                {dspInfo.icon}
                            </div>
                            <div className="flex-grow">
                                <h5 className="font-bold text-lg">{dspInfo.name}</h5>
                                <p className="text-sm text-gray-300 mb-2">{processor.reasoning || dspInfo.description}</p>
                                <div className="text-xs text-gray-600 font-mono bg-black/20 p-2 rounded">
                                    {paramsString}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const Prerequisites = () => {
        const checks = [
            { label: 'Audio Data Recorded', checked: !!audioData },
            { label: '3D Model Loaded', checked: !!roomModel },
            { label: 'API Key Configured', checked: !!apiConfig.apiKey }
        ];

        return (
            <div className="space-y-3">
                {checks.map(check => (
                    <div key={check.label} className="flex items-center text-lg">
                        {check.checked ? <CheckIcon size={24} className="text-green-500 mr-3" /> : <XIcon size={24} className="text-red-500 mr-3" />}
                        <span className={check.checked ? 'text-gray-300' : 'text-red-400'}>{check.label}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold gradient-text mb-2">AI Analysis & DSP Generation</h2>
                <p className="text-gray-600 text-lg">Leverage AI to create a custom DSP chain for your unique space</p>
            </div>

            <div className="card bg-white border border-gray-200">
                <div className="card-body grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold">Analysis Prerequisites</h3>
                        <Prerequisites />
                        <div className="pt-4">
                            <button
                                onClick={onGenerateChain}
                                disabled={!canAnalyze || isAnalyzing}
                                className={`w-full control-btn control-btn-primary py-4 px-6 rounded-lg text-lg font-bold flex items-center justify-center space-x-3 transition-all ${!canAnalyze || isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover-lift'}`}
                            >
                                {isAnalyzing ? <LoadingSpinner size={24} /> : <BrainIcon size={24} />}
                                <span>{isAnalyzing ? 'Analyzing... Please Wait' : 'Generate DSP Chain'}</span>
                            </button>
                        </div>
                        {!canAnalyze && (
                            <div className="status-card status-card-warning p-3 text-sm">
                                <div className="flex items-center">
                                    <AlertTriangleIcon size={20} className="mr-2" />
                                    <span>{!apiConfig.apiKey ? 'Please set your API Key in the Config tab.' : 'Please complete all previous steps.'}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="p-6 bg-white/50 rounded-lg border border-gray-200 space-y-4">
                        <div className="flex items-center space-x-3 text-purple-400">
                            <InfoIcon size={24} />
                            <h4 className="text-xl font-bold">How It Works</h4>
                        </div>
                        <p className="text-gray-300">When you click "Generate", the application will compile all the data you've provided:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                            <li>Your recorded room audio analysis.</li>
                            <li>The 3D model geometry (dimensions, volume).</li>
                            <li>The acoustic properties of your assigned materials.</li>
                        </ul>
                        <p className="text-gray-300">This data is sent to an AI model which returns a tailored DSP chain designed to correct issues in your specific room.</p>
                    </div>
                </div>
            </div>
            
            <div className="card bg-white border border-gray-200">
                <div className="card-header">
                    <h3 className="text-xl font-semibold flex items-center">
                        <span className="text-xl mr-2">🛰️</span>Generated DSP Chain
                    </h3>
                </div>
                <div className="card-body">
                    {isAnalyzing ? (
                        <div className="text-center py-10">
                            <div className="text-4xl animate-spin text-purple-400 mb-4">🧠</div>
                            <p className="text-lg font-semibold">AI is analyzing your data...</p>
                            <p className="text-gray-600">This may take up to a minute.</p>
                        </div>
                    ) : <DSPChainDisplay />}
                </div>
            </div>
        </div>
    );
};

export default AIAnalyzer;