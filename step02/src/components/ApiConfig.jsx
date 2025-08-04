// src/components/ApiConfig.jsx

export default function ApiConfig({ apiConfig, setApiConfig }) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl mt-6">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M15 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-2 13a4 4 0 1 1-4-4 4 4 0 0 1 4 4Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        API Configuration
      </h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Provider</label>
          <select
            value={apiConfig.provider}
            onChange={(e) => setApiConfig({ ...apiConfig, provider: e.target.value })}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
          >
            <option value="openrouter">OpenRouter</option>
            <option value="groq">Groq</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">API Key</label>
          <input
            type="password"
            value={apiConfig.apiKey}
            onChange={(e) => setApiConfig({ ...apiConfig, apiKey: e.target.value })}
            placeholder="sk-or-v1-..."
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Model</label>
          <select
            value={apiConfig.model}
            onChange={(e) => setApiConfig({ ...apiConfig, model: e.target.value })}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
          >
            <option value="deepseek/deepseek-r1-distill-llama-70b">DeepSeek 70B</option>
            <option value="anthropic/claude-3-haiku">Claude Haiku</option>
            <option value="google/gemini-pro">Gemini Pro</option>
          </select>
        </div>
      </div>
    </div>
  );
}