// File: src/components/analysis/ExportControls.jsx

window.ExportControls = ({ analysisResults, dspChain, audioData, roomModel }) => {

    const exportDataAsJSON = () => {
        const fullExportData = {
            timestamp: new Date().toISOString(),
            version: "1.0.0",
            analysis: analysisResults,
            dspChain: window.DSPUtils.exportDSPChainPreset(dspChain, { 
                name: `Analysis for ${roomModel?.fileName || 'Custom Room'}` 
            }),
            inputs: {
                audio: {
                    duration: audioData?.duration,
                    sampleRate: audioData?.sampleRate,
                    mode: audioData?.mode
                },
                model: {
                    fileName: roomModel?.fileName,
                    fileSize: roomModel?.fileSize,
                    dimensions: roomModel?.analysis?.dimensions,
                    totalSurfaceArea: roomModel?.analysis?.totalSurfaceArea,
                }
            }
        };

        const jsonString = JSON.stringify(fullExportData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `acoustic-analysis-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return React.createElement('div', { className: 'flex flex-col md:flex-row items-center justify-between gap-4' },
        React.createElement('p', { className: 'text-gray-400' },
            'Save a complete snapshot of your analysis for future reference.'
        ),
        React.createElement('button', {
            onClick: exportDataAsJSON,
            className: 'control-btn px-6 py-3 rounded-lg flex items-center space-x-2 hover-lift'
        },
            React.createElement(window.Icons.DownloadIcon, { size: 20 }),
            React.createElement('span', null, 'Export as JSON')
        )
    );
};

console.log('ExportControls component loaded');