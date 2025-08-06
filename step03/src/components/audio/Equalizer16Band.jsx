// File: src/components/audio/Equalizer16Band.jsx

window.Equalizer16Band = ({ initialGains, onBandChange }) => {
    const { useState } = React;

    const defaultGains = window.EQ_FREQUENCIES.reduce((acc, freq) => {
        acc[freq] = 0;
        return acc;
    }, {});
    
    const [gains, setGains] = useState(initialGains || defaultGains);

    const handleGainChange = (freq, value) => {
        const newGain = parseFloat(value);
        const newGains = { ...gains, [freq]: newGain };
        setGains(newGains);
        if (onBandChange) {
            onBandChange(freq, newGain);
        }
    };

    return React.createElement('div', { className: 'card' },
        React.createElement('div', { className: 'card-header' },
             React.createElement('h3', { className: 'text-xl font-semibold' }, '16-Band Graphic Equalizer')
        ),
        React.createElement('div', { className: 'card-body' },
            React.createElement('div', { className: 'flex justify-between gap-2 sm:gap-4 p-4 bg-gray-800/50 rounded-lg' },
                window.EQ_FREQUENCIES.map(freq => 
                    React.createElement('div', { key: freq, className: 'flex flex-col items-center flex-grow' },
                        React.createElement('div', { className: 'h-48 relative' },
                            React.createElement('input', {
                                type: 'range',
                                min: -12,
                                max: 12,
                                step: 0.1,
                                value: gains[freq],
                                onChange: (e) => handleGainChange(freq, e.target.value),
                                className: 'eq-slider'
                            })
                        ),
                        React.createElement('div', { className: 'mt-2 text-center' },
                            React.createElement('div', { className: 'text-sm font-bold' }, 
                                gains[freq].toFixed(1) + 'dB'
                            ),
                            React.createElement('div', { className: 'text-xs text-gray-400' },
                                window.FrequencyUtils.formatFrequency(freq) + 'Hz'
                            )
                        )
                    )
                )
            )
        )
    );
};