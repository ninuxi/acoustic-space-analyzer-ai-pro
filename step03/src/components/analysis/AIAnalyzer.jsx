// File: src/components/analysis/AIAnalyzer.jsx

window.AIAnalyzer = ({ 
    audioData, 
    roomModel, 
    materialAssignments, 
    apiConfig, 
    onGenerateChain, 
    isAnalyzing, 
    dspChain 
}) => {
    const { useState, useEffect } = React;

    const canAnalyze = audioData && roomModel && apiConfig.apiKey;

    // Funzione per renderizzare la catena DSP una volta generata
    const renderDSPChain = () => {
        if (dspChain.length === 0) {
            return React.createElement('p', { className: 'text-gray-400 text-center py-8' }, 
                'La catena DSP generata apparirà qui.'
            );
        }

        return React.createElement('div', { className: 'space-y-3' },
            dspChain.map((processor, index) => {
                const dspInfo = window.DSP_PROCESSORS[processor.type];
                if (!dspInfo) return null;

                // Formatta i parametri per la visualizzazione
                const paramsString = Object.entries(processor.params)
                    .map(([key, value]) => {
                        const paramDef = dspInfo.params[key];
                        return `${key}: ${window.DSPUtils.formatParameterValue(value, paramDef?.unit)}`;
                    })
                    .join(', ');

                return React.createElement('div', {
                    key: index,
                    className: 'p-4 rounded-lg flex items-start space-x-4 animate-fade-in',
                    style: { 
                        backgroundColor: `${dspInfo.color}20`, // Colore con 20% di opacità
                        borderColor: `${dspInfo.color}80`,    // Colore con 80% di opacità
                        borderLeftWidth: '4px',
                        animationDelay: `${index * 100}ms`
                    }
                },
                    React.createElement('div', { 
                        className: 'text-3xl flex-shrink-0 mt-1',
                        style: { color: dspInfo.color }
                    }, dspInfo.icon),
                    React.createElement('div', { className: 'flex-grow' },
                        React.createElement('h5', { className: 'font-bold text-lg' }, dspInfo.name),
                        React.createElement('p', { className: 'text-sm text-gray-300 mb-2' }, 
                            processor.reasoning || dspInfo.description
                        ),
                        React.createElement('div', { className: 'text-xs text-gray-400 font-mono bg-black/20 p-2 rounded' },
                            paramsString
                        )
                    )
                );
            })
        );
    };

    // Funzione per renderizzare lo stato dei prerequisiti
    const renderPrerequisites = () => {
        const checks = [
            { label: 'Dati Audio Registrati', checked: !!audioData },
            { label: 'Modello 3D Caricato', checked: !!roomModel },
            { label: 'Chiave API Configuratay', checked: !!apiConfig.apiKey }
        ];

        return React.createElement('div', { className: 'space-y-3' },
            checks.map(check => 
                React.createElement('div', { key: check.label, className: 'flex items-center text-lg' },
                    check.checked
                        ? React.createElement(window.Icons.CheckIcon, { size: 24, className: 'text-green-500 mr-3' })
                        : React.createElement(window.Icons.XIcon, { size: 24, className: 'text-red-500 mr-3' }),
                    React.createElement('span', { className: check.checked ? 'text-gray-300' : 'text-red-400 font-semibold' }, check.label)
                )
            )
        );
    };

    return React.createElement('div', { className: 'space-y-8' },
        // Header
        React.createElement('div', { className: 'text-center' },
            React.createElement('h2', { className: 'text-3xl font-bold gradient-text mb-2' },
                'AI Analysis & DSP Generation'
            ),
            React.createElement('p', { className: 'text-gray-400 text-lg' },
                "Sfrutta l'AI per creare una catena DSP su misura per il tuo spazio"
            )
        ),

        // Card Principale
        React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-body grid md:grid-cols-2 gap-8 items-center' },
                // Lato Sinistro: Prerequisiti e Azione
                React.createElement('div', { className: 'space-y-6' },
                    React.createElement('h3', { className: 'text-xl font-semibold' }, 'Prerequisiti per l\'Analisi'),
                    renderPrerequisites(),
                    React.createElement('div', { className: 'pt-4' },
                        React.createElement('button', {
                            onClick: onGenerateChain,
                            disabled: !canAnalyze || isAnalyzing,
                            className: `w-full control-btn control-btn-primary py-4 px-6 rounded-lg text-lg font-bold flex items-center justify-center space-x-3 transition-all ${
                                !canAnalyze || isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover-lift'
                            }`
                        },
                            isAnalyzing 
                                ? React.createElement(window.Icons.LoadingSpinner, { size: 24 })
                                : React.createElement(window.Icons.BrainIcon, { size: 24 }),
                            React.createElement('span', null, 
                                isAnalyzing ? 'Analisi in corso...' : 'Genera Catena DSP'
                            )
                        )
                    ),
                    !canAnalyze && React.createElement('div', { className: 'status-card status-card-warning p-3 text-sm' },
                        React.createElement('div', { className: 'flex items-center' },
                            React.createElement(window.Icons.AlertTriangleIcon, { size: 20, className: 'mr-2' }),
                            React.createElement('span', null, 
                                !apiConfig.apiKey 
                                    ? 'Imposta la tua chiave API nella scheda Config.'
                                    : 'Per favore, completa tutti i passaggi precedenti.'
                            )
                        )
                    )
                ),
                
                // Lato Destro: Spiegazione
                React.createElement('div', { className: 'p-6 bg-gray-800/50 rounded-lg border border-gray-700 space-y-4' },
                    React.createElement('div', { className: 'flex items-center space-x-3 text-purple-400' },
                        React.createElement(window.Icons.InfoIcon, { size: 24 }),
                        React.createElement('h4', { className: 'text-xl font-bold' }, 'Come Funziona')
                    ),
                    React.createElement('p', { className: 'text-gray-300' }, 
                        'Cliccando "Genera", l\'applicazione invierà i dati raccolti (audio, geometria 3D e materiali) a un modello AI che agirà come un ingegnere acustico esperto.'
                    ),
                    React.createElement('p', { className: 'text-gray-300' }, 
                        'L\'AI restituirà una catena di processori digitali (DSP) ottimizzata per correggere i problemi acustici e migliorare il suono nel tuo ambiente specifico.'
                    )
                )
            )
        ),
        
        // Area Risultati
        React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-header' },
                React.createElement('h3', { className: 'text-xl font-semibold flex items-center' },
                    React.createElement('span', { className: 'text-xl mr-2' }, '🛰️'),
                    'Catena DSP Generata'
                )
            ),
            React.createElement('div', { className: 'card-body min-h-[200px]' },
                isAnalyzing
                    ? React.createElement('div', { className: 'text-center py-10' },
                        React.createElement('div', { className: 'text-4xl animate-spin text-purple-400 mb-4' }, '🧠'),
                        React.createElement('p', { className: 'text-lg font-semibold' }, 'L\'AI sta analizzando i tuoi dati...'),
                        React.createElement('p', { className: 'text-gray-400' }, 'L\'operazione potrebbe richiedere fino a un minuto.')
                      )
                    : renderDSPChain()
            )
        )
    );
};

console.log('AIAnalyzer component loaded');