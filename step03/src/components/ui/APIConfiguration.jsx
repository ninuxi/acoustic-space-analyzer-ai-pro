// File: src/components/ui/APIConfiguration.jsx

window.APIConfiguration = ({ config, onConfigChange }) => {
    const { useState } = React;
    const [localConfig, setLocalConfig] = useState(config);

    const handleSave = () => {
        onConfigChange(localConfig);
        alert('Configuration saved!');
    };

    const handleProviderChange = (e) => {
        const newProvider = e.target.value;
        const newModel = newProvider === 'openrouter' 
            ? 'google/gemini-flash-1.5' 
            : 'llama3-8b-8192';
            
        setLocalConfig(prev => ({
            ...prev,
            provider: newProvider,
            model: newModel
        }));
    };

    const handleFieldChange = (e) => {
        setLocalConfig(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const models = {
        openrouter: [
            { id: 'google/gemini-flash-1.5', name: 'Google Gemini Flash 1.5' },
            { id: 'anthropic/claude-3-haiku', name: 'Anthropic Claude 3 Haiku' },
            { id: 'meta-llama/llama-3-8b-instruct', name: 'Meta Llama 3 8B' }
        ],
        groq: [
            { id: 'llama3-8b-8192', name: 'Llama3 8B 8k' },
            { id: 'gemma-7b-it', name: 'Gemma 7B IT' },
            { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B 32k' }
        ]
    };

    return React.createElement('div', { className: 'space-y-8 max-w-2xl mx-auto' },
        React.createElement('div', { className: 'text-center' },
            React.createElement('h2', { className: 'text-3xl font-bold gradient-text mb-2' }, 'API Configuration'),
            React.createElement('p', { className: 'text-gray-400 text-lg' }, 'Configure the AI model for analysis')
        ),
        React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-body space-y-6' },
                React.createElement('div', null,
                    React.createElement('label', { htmlFor: 'provider', className: 'block font-medium text-gray-300 mb-1' }, 'Provider'),
                    React.createElement('select', {
                        id: 'provider',
                        name: 'provider',
                        value: localConfig.provider,
                        onChange: handleProviderChange,
                        className: 'w-full p-2 rounded bg-gray-800 border border-gray-600 focus:ring-purple-500 focus:border-purple-500'
                    },
                        React.createElement('option', { value: 'openrouter' }, 'OpenRouter'),
                        React.createElement('option', { value: 'groq' }, 'Groq')
                    )
                ),
                React.createElement('div', null,
                    React.createElement('label', { htmlFor: 'apiKey', className: 'block font-medium text-gray-300 mb-1' }, 'API Key'),
                    React.createElement('input', {
                        type: 'password', id: 'apiKey', name: 'apiKey',
                        value: localConfig.apiKey, onChange: handleFieldChange,
                        placeholder: 'Enter your API key...',
                        className: 'w-full p-2 rounded bg-gray-800 border border-gray-600 focus:ring-purple-500 focus:border-purple-500'
                    }),
                    React.createElement('p', {className: 'text-xs text-gray-500 mt-1'}, 'Your key is stored only in your browser.')
                ),
                React.createElement('div', null,
                    React.createElement('label', { htmlFor: 'model', className: 'block font-medium text-gray-300 mb-1' }, 'AI Model'),
                    React.createElement('select', {
                        id: 'model', name: 'model',
                        value: localConfig.model, onChange: handleFieldChange,
                        className: 'w-full p-2 rounded bg-gray-800 border border-gray-600 focus:ring-purple-500 focus:border-purple-500'
                    },
                        (models[localConfig.provider] || []).map(m => 
                            React.createElement('option', { key: m.id, value: m.id }, m.name)
                        )
                    )
                ),
                React.createElement('button', {
                    onClick: handleSave,
                    className: 'w-full control-btn control-btn-primary py-3 rounded-lg'
                }, 'Save Configuration')
            )
        )
    );
};