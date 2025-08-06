// File: src/components/audio/RealTimeFFT.jsx

import React, { useState, useEffect, useRef } from 'react';

const RealTimeFFT = ({ analyserNode }) => {
    const [frequencyData, setFrequencyData] = useState(new Uint8Array(0));
    const animationFrameRef = useRef();

    useEffect(() => {
        if (!analyserNode) {
            setFrequencyData(new Uint8Array(0));
            // Cancella l'animazione se il nodo analizzatore viene rimosso
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            return;
        }

        // Prepara l'array per i dati di frequenza
        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Funzione per l'animazione
        const draw = () => {
            animationFrameRef.current = requestAnimationFrame(draw);
            analyserNode.getByteFrequencyData(dataArray);
            setFrequencyData(new Uint8Array(dataArray)); // Usa una nuova copia per forzare il re-render
        };

        draw();

        // Funzione di cleanup per fermare l'animazione quando il componente viene smontato
        return () => {
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, [analyserNode]); // L'effetto si riattiva solo se cambia l'analyserNode

    // Se non c'è un analizzatore, mostra un placeholder
    if (!analyserNode) {
        return (
            <div className="h-32 bg-white/50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">FFT Analyzer inactive</p>
            </div>
        );
    }

    // Per una migliore visualizzazione, campioniamo le barre invece di mostrarle tutte
    const numBars = 64;
    const displayData = [];
    if (frequencyData.length > 0) {
        const step = Math.floor(frequencyData.length / numBars);
        for (let i = 0; i < numBars; i++) {
            displayData.push(frequencyData[i * step] || 0);
        }
    }

    return (
        <div className="w-full h-32 flex items-end justify-between gap-px p-2 bg-gradient-to-t from-black/50 to-black/20 rounded-lg border border-gray-200">
            {displayData.map((value, i) => {
                const height = (value / 255) * 100;
                return (
                    <div
                        key={i}
                        className="fft-bar flex-grow"
                        style={{ height: `${height}%` }}
                    />
                );
            })}
        </div>
    );
};

export default RealTimeFFT;