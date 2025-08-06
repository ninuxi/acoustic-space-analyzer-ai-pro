// File: src/components/analysis/AnalysisResults.jsx

window.AnalysisResults = ({ analysisResults, dspChain, audioData, roomModel }) => {
    const { useState, useEffect } = React;

    if (!analysisResults) {
        return React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-body text-center py-16' },
                React.createElement('div', { className: 'text-4xl mb-4' }, '📊'),
                React.createElement('h3', { className: 'text-2xl font-bold text-gray-300' }, 'No Analysis Results'),
                React.createElement('p', { className: 'text-gray-400 mt-2' }, 'Please run the AI analysis on the previous tab to see the results here.')
            )
        );
    }

    const { roomData, aiAnalysis } = analysisResults;

    const renderMetric = (label, value, icon, unit = '') => {
        return React.createElement('div', { className: 'text-center p-4 bg-gray-700/50 rounded-lg' },
            React.createElement('div', { className: 'text-sm text-gray-400 mb-1 flex items-center justify-center' }, 
                React.createElement('span', {className: 'mr-2'}, icon), 
                label
            ),
            React.createElement('div', { className: 'text-2xl font-bold text-purple-400' },
                `${value}${unit}`
            )
        );
    };

    const renderDSPChain = () => {
        // Questa è una versione leggermente più dettagliata rispetto a quella in AIAnalyzer
        return React.createElement('div', { className: 'space-y-4' },
            dspChain.map((processor, index) => {
                const dspInfo = window.DSP_PROCESSORS[processor.type];
                if (!dspInfo) return null;

                return React.createElement('div', {
                    key: index,
                    className: 'p-4 rounded-lg flex items-start space-x-4',
                    style: { backgroundColor: `${dspInfo.color}20` }
                },
                    React.createElement('div', { className: 'text-3xl mt-1', style: { color: dspInfo.color } }, dspInfo.icon),
                    React.createElement('div', { className: 'flex-grow' },
                        React.createElement('h5', { className: 'font-bold text-lg' }, `${index + 1}. ${dspInfo.name}`),
                        React.createElement('p', { className: 'text-sm text-gray-300' }, processor.reasoning || dspInfo.description),
                        React.createElement('details', { className: 'mt-2 text-xs' },
                            React.createElement('summary', { className: 'cursor-pointer text-gray-400' }, 'Show Parameters'),
                            React.createElement('div', { className: 'font-mono bg-black/20 p-2 rounded mt-1' },
                                Object.entries(processor.params).map(([key, value]) => {
                                    const paramDef = dspInfo.params[key];
                                    return React.createElement('div', { key: key },
                                        `${key}: `,
                                        React.createElement('span', { className: 'text-yellow-400' },
                                            window.DSPUtils.formatParameterValue(value, paramDef?.unit)
                                        )
                                    );
                                }).reduce((acc, elem) => acc === null ? [elem] : [...acc, ', ', elem], null)
                            )
                        )
                    )
                );
            })
        );
    };

    return React.createElement('div', { className: 'space-y-8' },
        // Header
        React.createElement('div', { className: 'text-center' },
            React.createElement('h2', { className: 'text-3xl font-bold gradient-text mb-2' },
                'Analysis Results Dashboard'
            ),
            React.createElement('p', { className: 'text-gray-400 text-lg' },
                `Analysis completed on ${new Date(analysisResults.timestamp).toLocaleString()}`
            )
        ),
        
        // Summary Metrics
        React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4' },
            renderMetric('Room Volume', roomData.volume.toFixed(1), '🏠', 'm³'),
            renderMetric('Avg. RT60', roomData.avgRT60.toFixed(2), '⌛', 's'),
            renderMetric('Dynamic Range', (audioData.peakLevel - audioData.rmsLevel).toFixed(1), '📊', 'dB'),
            renderMetric('DSP Processors', dspChain.length, '🎚️')
        ),

        // AI Analysis & DSP Chain
        React.createElement('div', { className: 'grid lg:grid-cols-2 gap-8' },
            // AI Reasoning
            React.createElement('div', { className: 'card' },
                React.createElement('div', { className: 'card-header' },
                    React.createElement('h3', { className: 'text-xl font-semibold flex items-center' },
                        React.createElement(window.Icons.BrainIcon, { size: 24, className: 'mr-2' }),
                        'AI Analysis Summary'
                    )
                ),
                React.createElement('div', { className: 'card-body space-y-4' },
                    React.createElement('div', null,
                        React.createElement('h4', { className: 'font-semibold mb-1' }, 'Overall Reasoning:'),
                        React.createElement('p', { className: 'text-gray-300' }, aiAnalysis.reasoning)
                    ),
                    aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && React.createElement('div', null,
                        React.createElement('h4', { className: 'font-semibold mb-1' }, 'Additional Recommendations:'),
                        React.createElement('ul', { className: 'list-disc list-inside text-gray-300 space-y-1' },
                            aiAnalysis.recommendations.map((rec, i) => React.createElement('li', { key: i }, rec))
                        )
                    ),
                    React.createElement('div', { className: 'text-sm text-gray-500 text-right' },
                        `AI Confidence: ${(aiAnalysis.confidence * 100).toFixed(0)}%`
                    )
                )
            ),
            // DSP Chain
            React.createElement('div', { className: 'card' },
                React.createElement('div', { className: 'card-header' },
                    React.createElement('h3', { className: 'text-xl font-semibold flex items-center' },
                        React.createElement('span', { className: 'text-xl mr-2' }, '🛰️'),
                        'Final DSP Chain'
                    )
                ),
                React.createElement('div', { className: 'card-body' },
                    renderDSPChain()
                )
            )
        ),

        // Data Recap and Export
        React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-header' },
                React.createElement('h3', { className: 'text-xl font-semibold' }, 'Data Recap & Export')
            ),
            React.createElement('div', { className: 'card-body' },
                React.createElement(window.ExportControls, {
                    analysisResults,
                    dspChain,
                    audioData,
                    roomModel
                })
            )
        )
    );
};

console.log('AnalysisResults component loaded');