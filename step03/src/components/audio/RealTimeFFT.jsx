// File: src/components/audio/RealTimeFFT.jsx

window.RealTimeFFT = ({ analyserNode }) => {
    const { useState, useEffect, useRef } = React;
    const [frequencyData, setFrequencyData] = useState([]);
    const animationFrameRef = useRef();

    useEffect(() => {
        if (!analyserNode) {
            setFrequencyData([]);
            return;
        }

        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationFrameRef.current = requestAnimationFrame(draw);
            analyserNode.getByteFrequencyData(dataArray);
            
            // Aggiorna lo stato solo se i dati sono cambiati per ottimizzare i re-render
            setFrequencyData(prevData => {
                // Semplice controllo per vedere se i dati sono diversi
                if (prevData.length !== bufferLength || (dataArray[0] !== prevData[0] && dataArray[10] !== prevData[10])) {
                    return Array.from(dataArray);
                }
                return prevData;
            });
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, [analyserNode]);

    if (!analyserNode) {
        return React.createElement('div', { className: 'h-32 bg-gray-800/50 rounded-lg flex items-center justify-center' },
            React.createElement('p', { className: 'text-gray-500' }, 'FFT Analyzer inactive')
        );
    }

    // Mostriamo solo un sottoinsieme delle barre per una migliore visualizzazione
    const numBars = 64;
    const displayData = [];
    const step = Math.floor(frequencyData.length / numBars);
    for (let i = 0; i < numBars; i++) {
        const index = i * step;
        const value = frequencyData[index] || 0;
        displayData.push(value);
    }

    return React.createElement('div', { className: 'w-full h-32 flex items-end justify-between gap-px p-2 bg-gradient-to-t from-black/50 to-black/20 rounded-lg border border-gray-700' },
        displayData.map((value, i) => {
            const height = (value / 255) * 100;
            return React.createElement('div', {
                key: i,
                className: 'fft-bar flex-grow',
                style: { 
                    height: `${height}%`,
                    // Un tocco di colore in più
                    backgroundColor: `hsl(${(height/100) * 120 + 240}, 100%, 50%)`
                }
            });
        })
    );
};