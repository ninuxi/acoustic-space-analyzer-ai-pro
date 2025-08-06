// File: src/components/analysis/ExportControls.jsx

import React from 'react';
import { DownloadIcon } from '../ui/Icons.jsx';
import { DSPUtils } from '../../constants/dsp-processors.js';

const ExportControls = ({ analysisResults, dspChain, audioData, roomModel }) => {

    const exportDataAsJSON = () => {
        const fullExportData = {
            timestamp: new Date().toISOString(),
            version: "1.0.0",
            analysis: analysisResults,
            dspChainPreset: DSPUtils.exportDSPChainPreset(dspChain, { 
                name: `Analysis for ${roomModel?.fileName || 'Custom Room'}` 
            }),
            inputs: {
                audio: {
                    duration: audioData?.analysis?.duration,
                    sampleRate: audioData?.analysis?.sampleRate,
                },
                model: {
                    fileName: roomModel?.fileName,
                    fileSize: roomModel?.fileSize,
                    dimensions: roomModel?.analysis?.dimensions,
                }
            }
        };

        const jsonString = JSON.stringify(fullExportData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `acoustic-analysis-${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600">
                Save a complete snapshot of your analysis for future reference.
            </p>
            <button
                onClick={exportDataAsJSON}
                className="control-btn px-6 py-3 rounded-lg flex items-center space-x-2 hover-lift"
            >
                <DownloadIcon size={20} />
                <span>Export as JSON</span>
            </button>
        </div>
    );
};

export default ExportControls;