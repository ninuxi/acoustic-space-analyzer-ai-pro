// Audio Recording Component
const AudioRecorder = ({ 
    isRecording, 
    recordingTime, 
    audioData, 
    microphoneStatus, 
    onInitialize, 
    onStartRecording, 
    onStopRecording 
}) => {
    const [recordingLevel, setRecordingLevel] = React.useState(0);
    
    // Simulate recording level animation
    React.useEffect(() => {
        if (!isRecording) return;
        
        const interval = setInterval(() => {
            setRecordingLevel(Math.random() * 100);
        }, 100);
        
        return () => clearInterval(interval);
    }, [isRecording]);

    const getStatusConfig = () => {
        const configs = {
            'not-initialized': {
                color: 'bg-gray-700 text-gray-300',
                icon: '⚪',
                text: 'System not initialized'
            },
            'requesting': {
                color: 'bg-yellow-900/30 text-yellow-400',
                icon: '⏳',
                text: 'Requesting permissions...'
            },
            'denied': {
                color: 'bg-red-900/30 text-red-400',
                icon: '❌',
                text: 'Permissions denied'
            },
            'granted': {
                color: 'bg-green-900/30 text-green-400',
                icon: '✅',
                text: 'Microphone active'
            }
        };
        return configs[microphoneStatus] || configs['not-initialized'];
    };

    const getButtonConfig = () => {
        if (microphoneStatus !== 'granted') {
            return {
                onClick: onInitialize,
                disabled: microphoneStatus === 'requesting',
                className: 'bg-blue-600 hover:bg-blue-700',
                icon: React.createElement(MicIcon, { className: "mr-2" }),
                text: 'Initialize Microphone'
            };
        }
        
        if (isRecording) {
            return {
                onClick: onStopRecording,
                disabled: false,
                className: 'bg-red-600 hover:bg-red-700',
                icon: React.createElement(StopIcon, { className: "mr-2" }),
                text: `Stop (${(15 - recordingTime).toFixed(1)}s)`
            };
        }
        
        return {
            onClick: onStartRecording,
            disabled: false,
            className: 'bg-cyan-600 hover:bg-cyan-700',
            icon: React.createElement(PlayIcon, { className: "mr-2" }),
            text: 'Record Pink Noise (15s)'
        };
    };

    const statusConfig = getStatusConfig();
    const buttonConfig = getButtonConfig();

    return React.createElement('div', {
        className: "bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700 animate-slide-left"
    },
        // Header
        React.createElement('h3', {
            className: "text-xl font-semibold mb-4 flex items-center"
        },
            React.createElement(MicIcon, { className: "mr-2 text-cyan-400" }),
            'Audio Recording'
        ),
        
        // Status Indicator
        React.createElement('div', {
            className: "mb-4"
        },
            React.createElement('div', {
                className: `text-center py-2 px-3 rounded-lg transition-all ${statusConfig.color}`
            },
                `${statusConfig.icon} ${statusConfig.text}`
            )
        ),
        
        // Recording Level Indicator (when recording)
        isRecording && React.createElement('div', {
            className: "mb-4"
        },
            React.createElement('div', {
                className: "text-xs text-gray-400 mb-1"
            }, 'Input Level'),
            React.createElement('div', {
                className: "bg-gray-700 rounded-full h-2 overflow-hidden"
            },
                React.createElement('div', {
                    className: "bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-full transition-all duration-100",
                    style: { width: `${recordingLevel}%` }
                })
            )
        ),
        
        // Main Recording Button
        React.createElement('button', {
            onClick: buttonConfig.onClick,
            disabled: buttonConfig.disabled,
            className: `w-full py-3 px-4 rounded-lg font-medium transition-all control-btn ${buttonConfig.className} ${buttonConfig.disabled ? 'cursor-not-allowed opacity-50' : 'active:scale-95 hover-lift'}`
        },
            React.createElement('div', {
                className: "flex items-center justify-center"
            },
                buttonConfig.icon,
                buttonConfig.text
            )
        ),
        
        // Progress Bar (when recording)
        isRecording && React.createElement('div', {
            className: "mt-3 animate-fade-in"
        },
            React.createElement('div', {
                className: "progress-bar rounded-full h-2 overflow-hidden"
            },
                React.createElement('div', {
                    className: "progress-fill h-full transition-all duration-100",
                    style: { width: `${(recordingTime / 15) * 100}%` }
                })
            ),
            React.createElement('div', {
                className: "flex justify-between text-xs text-gray-400 mt-1"
            },
                React.createElement('span', null, `${recordingTime.toFixed(1)}s`),
                React.createElement('span', null, '15.0s')
            )
        ),
        
        // Recording Status
        audioData && React.createElement('div', {
            className: "mt-3 text-sm text-green-400 flex items-center animate-fade-in"
        },
            React.createElement(CheckIcon, { size: 16, className: "mr-2" }),
            `${audioData.length} samples captured`
        ),
        
        // Help Text
        microphoneStatus === 'denied' && React.createElement('div', {
            className: "mt-3 p-3 bg-red-900/20 border border-red-700/30 rounded-lg animate-fade-in"
        },
            React.createElement('div', {
                className: "flex items-start"
            },
                React.createElement(AlertTriangleIcon, { size: 16, className: "mr-2 text-red-400 mt-0.5 flex-shrink-0" }),
                React.createElement('div', {
                    className: "text-sm text-red-300"
                },
                    React.createElement('p', { className: "font-semibold mb-1" }, 'Microphone Access Denied'),
                    React.createElement('p', null, 'Click the microphone icon in your browser\'s address bar and allow access, then try again.')
                )
            )
        ),
        
        // Recording Tips
        microphoneStatus === 'granted' && !isRecording && !audioData && React.createElement('div', {
            className: "mt-3 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg animate-fade-in"
        },
            React.createElement('div', {
                className: "flex items-start"
            },
                React.createElement(InfoIcon, { size: 16, className: "mr-2 text-blue-400 mt-0.5 flex-shrink-0" }),
                React.createElement('div', {
                    className: "text-sm text-blue-300"
                },
                    React.createElement('p', { className: "font-semibold mb-1" }, 'Recording Tips'),
                    React.createElement('ul', { className: "space-y-1 text-xs" },
                        React.createElement('li', null, '• Play pink noise through your speakers'),
                        React.createElement('li', null, '• Set volume to comfortable listening level'),
                        React.createElement('li', null, '• Minimize background noise during recording')
                    )
                )
            )
        )
    );
};