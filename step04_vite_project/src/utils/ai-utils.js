// File: src/utils/ai-utils.js

import { DSP_PROCESSORS } from '../constants/dsp-processors.js';
import { MaterialUtils } from '../constants/materials.js';

export const AIUtils = {
    defaultConfig: {
        provider: 'openrouter',
        model: 'anthropic/claude-3-haiku',
        baseURL: 'https://openrouter.ai/api/v1',
        maxTokens: 2000,
        temperature: 0.3
    },

    generateDSPChain: async (roomData, audioData, apiConfig) => {
        const config = { ...AIUtils.defaultConfig, ...apiConfig };
        
        if (!config.apiKey) {
            throw new Error('API key is required');
        }

        const prompt = AIUtils.buildAnalysisPrompt(roomData, audioData);
        
        try {
            const response = await AIUtils.callAI(prompt, config);
            const dspChain = AIUtils.parseDSPResponse(response);
            
            return {
                success: true,
                dspChain: dspChain,
                reasoning: response.reasoning || 'AI analysis completed',
                confidence: response.confidence || 0.8,
                recommendations: response.recommendations || []
            };
        } catch (error) {
            console.error('AI DSP generation failed:', error);
            return { success: false, error: error.message };
        }
    },

    buildAnalysisPrompt: (roomData, audioData) => {
        const prompt = `You are an expert acoustic engineer. Analyze the following data to generate an optimal DSP processing chain.

**ROOM ANALYSIS:**
- Dimensions: ${roomData.dimensions?.width?.toFixed(1)}m × ${roomData.dimensions?.depth?.toFixed(1)}m × ${roomData.dimensions?.height?.toFixed(1)}m
- Volume: ${roomData.volume?.toFixed(1)} m³
- Average RT60: ${roomData.avgRT60?.toFixed(2)}s
- Total Surface Area: ${roomData.totalSurfaceArea?.toFixed(1)} m²

**SURFACE MATERIALS ANALYSIS:**
${AIUtils.formatSurfaceAnalysis(roomData.surfaces)}

**FREQUENCY RESPONSE ANALYSIS (DEVIATION FROM PINK NOISE REFERENCE):**
${AIUtils.formatFrequencyAnalysis(audioData?.analysis?.frequencyResponse)}

**REQUIREMENTS:**
Generate a DSP chain to address the identified acoustic issues.

**OUTPUT FORMAT:**
Respond ONLY with a valid JSON object matching this structure:
{
  "dspChain": [
    {
      "type": "processor_type",
      "params": { "parameter": value },
      "reasoning": "Brief technical reason for this processor and its settings."
    }
  ],
  "reasoning": "Overall analysis explanation.",
  "confidence": 0.85,
  "recommendations": ["Additional suggestions..."]
}

**AVAILABLE PROCESSORS:**
${Object.keys(DSP_PROCESSORS).join(', ')}`;

        return prompt;
    },

    formatSurfaceAnalysis: (surfaces) => {
        if (!surfaces || !surfaces.length) return 'No surface data available';
        // ... (Questa funzione interna usa MaterialUtils, che ora è importato)
        return 'Surface analysis data...'; // Placeholder per brevità
    },

    formatFrequencyAnalysis: (frequencyResponse) => {
        if (!frequencyResponse || !frequencyResponse.length) {
            return 'No frequency response data available';
        }
        // ... (Questa funzione interna formatta i dati della frequenza)
        return 'Frequency analysis data...'; // Placeholder per brevità
    },

    callAI: async (prompt, config) => {
        const requestBody = {
            model: config.model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: config.maxTokens,
            temperature: config.temperature,
            response_format: { type: "json_object" } // Richiede una risposta JSON
        };

        const response = await fetch(config.baseURL + '/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Acoustic Space Analyzer AI Pro'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        return JSON.parse(content);
    },

    parseDSPResponse: (response) => {
        if (!response.dspChain || !Array.isArray(response.dspChain)) {
            throw new Error('Invalid DSP chain format in AI response');
        }

        return response.dspChain.map((processor) => {
            if (!processor.type || !DSP_PROCESSORS[processor.type]) {
                console.warn(`AI suggested an unknown processor type: ${processor.type}`);
                return null;
            }
            // Qui si potrebbero aggiungere ulteriori validazioni dei parametri
            return processor;
        }).filter(p => p !== null);
    }
};