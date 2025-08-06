// API Configuration Component
const APIConfiguration = ({ apiConfig, onConfigChange }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [testingConnection, setTestingConnection] = React.useState(false);
    const [connectionStatus, setConnectionStatus] = React.useState(null);

    // Test API connection
    const testConnection = async () => {
        if (!apiConfig.apiKey) {
            alert('Please enter an API key first');
            return;
        }

        setTestingConnection(true);
        setConnectionStatus(null);

        try {
            const testPrompt = "Test connection. Respond with: OK";
            let response;

            if (apiConfig.provider === 'openrouter') {
                response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiConfig.apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': window.location.href,
                        'X-Title': 'Acoustic Analyzer AI Test'
                    },
                    body: JSON.stringify({
                        model: apiConfig.model,
                        messages: [{ role: 'user', content: testPrompt }],
                        max_tokens: 10,
                        temperature: 0
                    })
                });
            } else if (apiConfig.provider === 'groq') {
                response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiConfig.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'llama-3.3-70b-versatile',
                        messages: [{ role: 'user', content: testPrompt }],
                        max_tokens: 10,
                        temperature: 0
                    })
                });
            }

            if (response.ok) {
                const data = await response.json();
                setConnectionStatus({ success: true, message: 'Connection successful!' });
            } else {
                const errorText = await response.text();
                setConnectionStatus({ 
                    success: false, 
                    message: `Error ${response.status}: ${errorText}` 
                });
            }
        } catch (error) {
            setConnectionStatus({ 
                success: false, 
                message: `Connection failed: ${error.message}` 
            });
        }

        setTestingConnection(false);
    };

    // Get provider info
    const getProviderInfo = () => {
        const providers = {
            openrouter: {
                name: 'OpenRouter',
                description: 'Access multiple AI models through one API',
                signupUrl: 'https://openrouter.ai',
                features: ['Multiple models', 'Pay-per-use', 'Free tier available'],
                models: [
                    { value: 'deepseek/deepseek-r1-distill-llama-70b', name: 'DeepSeek R1 70B (Recommended)' },
                    { value: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B' },
                    { value: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5' },
                    { value: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' }
                ]
            },
            groq: {
                name: 'Groq',
                description: 'Ultra-fast inference with specialized hardware',
                signupUrl: 'https://console.groq.com',
                features: ['Lightning fast', 'Free tier', 'Open source models'],
                models: [
                    { value: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B (Recommended)' },
                    { value: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
                    { value: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B' }
                ]
            }
        };
        return providers[apiConfig.provider] || providers.openrouter;
    };

    const providerInfo = getProviderInfo();

    return React.createElement('div', {
        className: "bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 mb-8 overflow-hidden animate-slide-up"
    },
        // Header with toggle
        React.createElement('div', {
            className: "p-6 cursor-pointer hover:bg-gray-700/30 transition-colors",
            onClick: () => setIsExpanded(!isExpanded)
        },
            React.createElement('div', {
                className: "flex items-center justify-between"
            },
                React.createElement('h3', {
                    className: "text-xl font-semibold flex items-center"
                },
                    React.createElement(KeyIcon, { className: "mr-2 text-yellow-400" }),
                    'AI API Configuration'
                ),
                React.createElement('div', {
                    className: "flex items-center space-x-3"
                },
                    // Connection status indicator
                    connectionStatus && React.createElement('div', {
                        className: `text-sm px-2 py-1 rounded ${
                            connectionStatus.success 
                                ? 'bg-green-900/30 text-green-400' 
                                : 'bg-red-900/30 text-red-400'
                        }`
                    }, connectionStatus.success ? '✅ Connected' : '❌ Error'),
                    
                    // API Key status
                    React.createElement('div', {
                        className: `text-sm px-2 py-1 rounded ${
                            apiConfig.apiKey 
                                ? 'bg-green-900/30 text-green-400' 
                                : 'bg-yellow-900/30 text-yellow-400'
                        }`
                    }, apiConfig.apiKey ? '🔑 Configured' : '⚠️ Not configured'),
                    
                    // Expand/collapse icon
                    React.createElement('div', {
                        className: `transform transition-transform ${isExpanded ? 'rotate-180' : ''}`
                    }, '▼')
                )
            )
        ),

        // Expanded content
        isExpanded && React.createElement('div', {
            className: "px-6 pb-6 animate-fade-in"
        },
            // Provider selection and info
            React.createElement('div', {
                className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
            },
                // Provider selection
                React.createElement('div', null,
                    React.createElement('label', {
                        className: "block text-sm font-medium text-gray-400 mb-2"
                    }, 'AI Provider'),
                    React.createElement('select', {
                        value: apiConfig.provider,
                        onChange: (e) => onConfigChange({ 
                            ...apiConfig, 
                            provider: e.target.value,
                            model: getProviderInfo().models[0].value // Reset to first model
                        }),
                        className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                    },
                        React.createElement('option', { value: 'openrouter' }, 'OpenRouter'),
                        React.createElement('option', { value: 'groq' }, 'Groq')
                    )
                ),

                // API Key input
                React.createElement('div', null,
                    React.createElement('label', {
                        className: "block text-sm font-medium text-gray-400 mb-2"
                    }, 'API Key'),
                    React.createElement('div', {
                        className: "relative"
                    },
                        React.createElement('input', {
                            type: 'password',
                            value: apiConfig.apiKey,
                            onChange: (e) => onConfigChange({ ...apiConfig, apiKey: e.target.value }),
                            placeholder: apiConfig.provider === 'openrouter' ? 'sk-or-v1-...' : 'gsk_...',
                            className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 transition-colors pr-10"
                        }),
                        apiConfig.apiKey && React.createElement('div', {
                            className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400"
                        }, '✓')
                    )
                ),

                // Model selection
                React.createElement('div', null,
                    React.createElement('label', {
                        className: "block text-sm font-medium text-gray-400 mb-2"
                    }, 'Model'),
                    React.createElement('select', {
                        value: apiConfig.model,
                        onChange: (e) => onConfigChange({ ...apiConfig, model: e.target.value }),
                        className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                    },
                        ...providerInfo.models.map(model => 
                            React.createElement('option', { key: model.value, value: model.value }, model.name)
                        )
                    )
                )
            ),

            // Provider information card
            React.createElement('div', {
                className: "bg-gray-700/30 rounded-lg p-4 mb-4"
            },
                React.createElement('div', {
                    className: "flex items-start justify-between mb-3"
                },
                    React.createElement('div', null,
                        React.createElement('h4', {
                            className: "font-semibold text-white mb-1"
                        }, providerInfo.name),
                        React.createElement('p', {
                            className: "text-sm text-gray-300"
                        }, providerInfo.description)
                    ),
                    React.createElement('a', {
                        href: providerInfo.signupUrl,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        className: "text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition-colors"
                    }, 'Get API Key')
                ),
                React.createElement('div', {
                    className: "flex flex-wrap gap-2"
                },
                    ...providerInfo.features.map((feature, index) => 
                        React.createElement('span', {
                            key: index,
                            className: "text-xs bg-gray-600 px-2 py-1 rounded"
                        }, feature)
                    )
                )
            ),

            // Actions
            React.createElement('div', {
                className: "flex items-center space-x-3"
            },
                React.createElement('button', {
                    onClick: testConnection,
                    disabled: !apiConfig.apiKey || testingConnection,
                    className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors control-btn"
                },
                    testingConnection 
                        ? React.createElement('div', {
                            className: "flex items-center"
                        },
                            React.createElement(LoadingSpinner, { size: 16, className: "mr-2" }),
                            'Testing...'
                        )
                        : 'Test Connection'
                ),

                // Clear config button
                React.createElement('button', {
                    onClick: () => {
                        onConfigChange({
                            provider: 'openrouter',
                            apiKey: '',
                            model: 'deepseek/deepseek-r1-distill-llama-70b'
                        });
                        setConnectionStatus(null);
                    },
                    className: "px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors control-btn"
                }, 'Clear Config')
            ),

            // Connection status message
            connectionStatus && React.createElement('div', {
                className: `mt-4 p-3 rounded-lg ${
                    connectionStatus.success 
                        ? 'bg-green-900/20 border border-green-700/30' 
                        : 'bg-red-900/20 border border-red-700/30'
                } animate-fade-in`
            },
                React.createElement('div', {
                    className: `text-sm ${
                        connectionStatus.success ? 'text-green-300' : 'text-red-300'
                    }`
                }, connectionStatus.message)
            )
        )
    );
};