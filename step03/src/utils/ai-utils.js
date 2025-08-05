// AI Utilities for DSP Chain Generation and Analysis

window.AIUtils = {
    // Default API configuration
    defaultConfig: {
        provider: 'openrouter',
        model: 'anthropic/claude-3-haiku',
        baseURL: 'https://openrouter.ai/api/v1',
        maxTokens: 2000,
        temperature: 0.3
    },

    // Generate DSP chain using AI analysis
    generateDSPChain: async (roomData, audioData, apiConfig) => {
        const config = { ...window.AIUtils.defaultConfig, ...apiConfig };
        
        if (!config.apiKey) {
            throw new Error('API key is required');
        }

        const prompt = window.AIUtils.buildAnalysisPrompt(roomData, audioData);
        
        try {
            const response = await window.AIUtils.callAI(prompt, config);
            const dspChain = window.AIUtils.parseDSPResponse(response);
            
            return {
                success: true,
                dspChain: dspChain,
                reasoning: response.reasoning || 'AI analysis completed',
                confidence: response.confidence || 0.8,
                recommendations: response.recommendations || []
            };
        } catch (error) {
            console.error('AI DSP generation failed:', error);
            return {
                success: false,
                error: error.message,
                fallbackChain: window.AIUtils.generateFallbackChain(roomData)
            };
        }
    },

    // Build comprehensive analysis prompt
    buildAnalysisPrompt: (roomData, audioData) => {
        const prompt = `You are an expert acoustic engineer and DSP specialist. Analyze the following room and audio data to generate an optimal DSP processing chain.

**ROOM ANALYSIS:**
- Dimensions: ${roomData.dimensions?.width?.toFixed(1)}m × ${roomData.dimensions?.depth?.toFixed(1)}m × ${roomData.dimensions?.height?.toFixed(1)}m
- Volume: ${roomData.volume?.toFixed(1)} m³
- Average RT60: ${roomData.avgRT60?.toFixed(2)}s
- Room Classification: ${roomData.classification || 'Unknown'}
- Total Surface Area: ${roomData.totalSurfaceArea?.toFixed(1)} m²

**SURFACE MATERIALS:**
${window.AIUtils.formatSurfaceAnalysis(roomData.surfaces)}

**FREQUENCY RESPONSE ANALYSIS:**
${window.AIUtils.formatFrequencyAnalysis(audioData?.frequencyResponse)}

**AUDIO METRICS:**
- Peak Level: ${audioData?.peakLevel?.toFixed(1)} dB
- RMS Level: ${audioData?.rmsLevel?.toFixed(1)} dB
- Dynamic Range: ${(audioData?.peakLevel - audioData?.rmsLevel)?.toFixed(1)} dB
- THD+N: ${audioData?.thdn?.toFixed(2)}%

**REQUIREMENTS:**
Generate a DSP chain that addresses the specific acoustic issues identified. Consider:
1. Room modes and standing waves
2. Reverberation control
3. Frequency response correction
4. Dynamic range optimization
5. Noise floor management

**OUTPUT FORMAT:**
Respond with a JSON object containing:
{
  "dspChain": [
    {
      "type": "processor_type",
      "params": { "parameter": value },
      "reasoning": "Why this processor is needed"
    }
  ],
  "reasoning": "Overall analysis explanation",
  "confidence": 0.85,
  "recommendations": ["Additional suggestions"],
  "issues_addressed": ["List of problems solved"]
}

**AVAILABLE PROCESSORS:**
${Object.keys(window.DSP_PROCESSORS).join(', ')}

**IMPORTANT:** Only use processors from the available list. Ensure all parameters are within valid ranges. Provide specific numeric values, not ranges.`;

        return prompt;
    },

    // Format surface analysis for prompt
    formatSurfaceAnalysis: (surfaces) => {
        if (!surfaces || !surfaces.length) return 'No surface data available';
        
        const surfacesByType = {};
        surfaces.forEach(surface => {
            if (!surfacesByType[surface.type]) {
                surfacesByType[surface.type] = [];
            }
            surfacesByType[surface.type].push(surface);
        });

        let analysis = '';
        Object.entries(surfacesByType).forEach(([type, surfaceList]) => {
            const totalArea = surfaceList.reduce((sum, s) => sum + s.area, 0);
            const avgAbsorption = surfaceList.reduce((sum, s) => {
                const material = s.assignedMaterial || 'plasterboard';
                return sum + window.MaterialUtils.calculateAverageAbsorption(material);
            }, 0) / surfaceList.length;
            
            analysis += `- ${type.charAt(0).toUpperCase() + type.slice(1)}: ${totalArea.toFixed(1)}m² (avg absorption: ${avgAbsorption.toFixed(2)})\n`;
        });

        return analysis;
    },

    // Format frequency analysis for prompt
    formatFrequencyAnalysis: (frequencyResponse) => {
        if (!frequencyResponse || !frequencyResponse.length) {
            return 'No frequency response data available';
        }

        const analysis = [];
        const problematicFreqs = frequencyResponse
            .filter(freq => Math.abs(freq.deviation || 0) > 3)
            .sort((a, b) => Math.abs(b.deviation) - Math.abs(a.deviation))
            .slice(0, 5);

        if (problematicFreqs.length > 0) {
            analysis.push('**Problematic Frequencies:**');
            problematicFreqs.forEach(freq => {
                const issue = freq.deviation > 0 ? 'boost' : 'cut';
                analysis.push(`- ${freq.frequency}Hz: ${Math.abs(freq.deviation).toFixed(1)}dB ${issue}`);
            });
        }

        // Frequency range analysis
        const ranges = {
            'Sub Bass (20-60Hz)': frequencyResponse.filter(f => f.frequency >= 20 && f.frequency <= 60),
            'Bass (60-250Hz)': frequencyResponse.filter(f => f.frequency > 60 && f.frequency <= 250),
            'Low Mid (250-500Hz)': frequencyResponse.filter(f => f.frequency > 250 && f.frequency <= 500),
            'Mid (500-2kHz)': frequencyResponse.filter(f => f.frequency > 500 && f.frequency <= 2000),
            'High Mid (2-4kHz)': frequencyResponse.filter(f => f.frequency > 2000 && f.frequency <= 4000),
            'Presence (4-6kHz)': frequencyResponse.filter(f => f.frequency > 4000 && f.frequency <= 6000),
            'Brilliance (6-20kHz)': frequencyResponse.filter(f => f.frequency > 6000)
        };

        analysis.push('\n**Frequency Range Analysis:**');
        Object.entries(ranges).forEach(([range, freqs]) => {
            if (freqs.length > 0) {
                const avgDeviation = freqs.reduce((sum, f) => sum + (f.deviation || 0), 0) / freqs.length;
                if (Math.abs(avgDeviation) > 1) {
                    const trend = avgDeviation > 0 ? 'elevated' : 'attenuated';
                    analysis.push(`- ${range}: ${Math.abs(avgDeviation).toFixed(1)}dB ${trend}`);
                }
            }
        });

        return analysis.join('\n');
    },

    // Call AI API with proper error handling
    callAI: async (prompt, config) => {
        const requestBody = {
            model: config.model,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: config.maxTokens,
            temperature: config.temperature
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
        
        if (!data.choices || data.choices.length === 0) {
            throw new Error('No response from AI model');
        }

        const content = data.choices[0].message.content;
        
        try {
            // Extract JSON from response (handle potential markdown formatting)
            const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || 
                             content.match(/\{[\s\S]*\}/);
            
            if (jsonMatch) {
                return JSON.parse(jsonMatch[1] || jsonMatch[0]);
            } else {
                throw new Error('No valid JSON found in response');
            }
        } catch (parseError) {
            console.warn('Failed to parse AI response as JSON:', parseError);
            return {
                dspChain: window.AIUtils.extractDSPFromText(content),
                reasoning: content,
                confidence: 0.6
            };
        }
    },

    // Parse DSP response and validate
    parseDSPResponse: (response) => {
        if (!response.dspChain || !Array.isArray(response.dspChain)) {
            throw new Error('Invalid DSP chain format');
        }

        const validatedChain = response.dspChain.map((processor, index) => {
            if (!processor.type || !window.DSP_PROCESSORS[processor.type]) {
                console.warn(`Unknown processor type: ${processor.type}`);
                return null;
            }

            const processorDef = window.DSP_PROCESSORS[processor.type];
            const validatedParams = {};

            // Validate and clamp parameters
            Object.entries(processor.params || {}).forEach(([paramName, value]) => {
                const paramDef = processorDef.params[paramName];
                if (paramDef) {
                    const clampedValue = Math.max(paramDef.min, Math.min(paramDef.max, value));
                    validatedParams[paramName] = clampedValue;
                    
                    if (clampedValue !== value) {
                        console.warn(`Parameter ${paramName} clamped from ${value} to ${clampedValue}`);
                    }
                } else {
                    console.warn(`Unknown parameter: ${paramName} for processor ${processor.type}`);
                }
            });

            // Fill in missing parameters with defaults
            Object.entries(processorDef.params).forEach(([paramName, paramDef]) => {
                if (!(paramName in validatedParams)) {
                    validatedParams[paramName] = paramDef.default;
                }
            });

            return {
                type: processor.type,
                params: validatedParams,
                reasoning: processor.reasoning || `${processorDef.description}`,
                id: `ai_processor_${index}`
            };
        }).filter(p => p !== null);

        if (validatedChain.length === 0) {
            throw new Error('No valid processors in DSP chain');
        }

        return validatedChain;
    },

    // Extract DSP chain from text response (fallback)
    extractDSPFromText: (text) => {
        const chain = [];
        const lines = text.split('\n');
        
        lines.forEach(line => {
            const lowerLine = line.toLowerCase();
            
            // Look for processor mentions
            Object.keys(window.DSP_PROCESSORS).forEach(processorType => {
                const processor = window.DSP_PROCESSORS[processorType];
                const processorName = processor.name.toLowerCase();
                
                if (lowerLine.includes(processorName) || lowerLine.includes(processorType)) {
                    // Extract basic parameters if mentioned
                    const params = {};
                    
                    // Look for frequency mentions
                    const freqMatch = line.match(/(\d+)\s*hz/i);
                    if (freqMatch && processor.params.frequency) {
                        params.frequency = parseInt(freqMatch[1]);
                    }
                    
                    // Look for dB mentions
                    const dbMatch = line.match(/([-+]?\d+(?:\.\d+)?)\s*db/i);
                    if (dbMatch && (processor.params.gain || processor.params.threshold)) {
                        const dbValue = parseFloat(dbMatch[1]);
                        if (processor.params.gain) params.gain = dbValue;
                        if (processor.params.threshold) params.threshold = dbValue;
                    }
                    
                    // Fill in defaults for missing params
                    Object.entries(processor.params).forEach(([paramName, paramDef]) => {
                        if (!(paramName in params)) {
                            params[paramName] = paramDef.default;
                        }
                    });
                    
                    chain.push({
                        type: processorType,
                        params: params,
                        reasoning: `Extracted from text analysis`
                    });
                }
            });
        });
        
        return chain.length > 0 ? chain : window.AIUtils.generateFallbackChain();
    },

    // Generate fallback DSP chain when AI fails
    generateFallbackChain: (roomData = {}) => {
        const chain = [];
        
        // Always start with HPF
        chain.push({
            type: 'hpf',
            params: {
                frequency: roomData.volume && roomData.volume < 100 ? 40 : 25,
                q: 0.707
            },
            reasoning: 'Remove subsonic frequencies and reduce room modes'
        });
        
        // Add EQ based on room size
        if (roomData.avgRT60) {
            if (roomData.avgRT60 > 1.5) {
                // Reverberant room - reduce mid frequencies
                chain.push({
                    type: 'eq',
                    params: {
                        frequency: 500,
                        gain: -2,
                        q: 1.5
                    },
                    reasoning: 'Reduce muddiness in reverberant room'
                });
            } else if (roomData.avgRT60 < 0.6) {
                // Dead room - add some life
                chain.push({
                    type: 'eq',
                    params: {
                        frequency: 3000,
                        gain: 1.5,
                        q: 1
                    },
                    reasoning: 'Add presence in acoustically dead room'
                });
            }
        }
        
        // Add compressor for dynamic control
        chain.push({
            type: 'compressor',
            params: {
                threshold: -18,
                ratio: 3,
                attack: 10,
                release: 100,
                knee: 2
            },
            reasoning: 'Provide gentle dynamic control'
        });
        
        // Add limiter for protection
        chain.push({
            type: 'limiter',
            params: {
                threshold: -3,
                release: 10,
                lookahead: 2
            },
            reasoning: 'Prevent clipping and protect equipment'
        });
        
        return chain;
    },

    // Analyze room acoustics with AI
    analyzeRoomAcoustics: async (roomData, apiConfig) => {
        const config = { ...window.AIUtils.defaultConfig, ...apiConfig };
        
        const prompt = `Analyze this acoustic space and provide detailed insights:

**ROOM DATA:**
${JSON.stringify(roomData, null, 2)}

Provide analysis in JSON format:
{
  "acousticProfile": "Room acoustic characteristics",
  "strengths": ["Positive aspects"],
  "weaknesses": ["Areas for improvement"], 
  "recommendations": ["Specific suggestions"],
  "suitability": {
    "recording": "score 0-10",
    "mixing": "score 0-10", 
    "listening": "score 0-10",
    "broadcast": "score 0-10"
  },
  "treatmentSuggestions": ["Physical treatment recommendations"]
}`;

        try {
            const response = await window.AIUtils.callAI(prompt, config);
            return { success: true, analysis: response };
        } catch (error) {
            return { 
                success: false, 
                error: error.message,
                fallback: window.AIUtils.generateBasicRoomAnalysis(roomData)
            };
        }
    },

    // Generate basic room analysis (fallback)
    generateBasicRoomAnalysis: (roomData) => {
        const analysis = {
            acousticProfile: 'Basic analysis based on room metrics',
            strengths: [],
            weaknesses: [],
            recommendations: [],
            suitability: { recording: 5, mixing: 5, listening: 5, broadcast: 5 },
            treatmentSuggestions: []
        };

        if (roomData.avgRT60) {
            if (roomData.avgRT60 < 0.4) {
                analysis.acousticProfile = 'Very dry, anechoic characteristics';
                analysis.strengths.push('Excellent isolation', 'Minimal reflections');
                analysis.weaknesses.push('May sound unnatural', 'Lack of ambience');
                analysis.suitability.recording = 9;
                analysis.suitability.mixing = 8;
            } else if (roomData.avgRT60 < 0.8) {
                analysis.acousticProfile = 'Well-controlled acoustics';
                analysis.strengths.push('Good balance of clarity and ambience');
                analysis.suitability.recording = 8;
                analysis.suitability.mixing = 9;
                analysis.suitability.listening = 8;
            } else if (roomData.avgRT60 > 2.0) {
                analysis.acousticProfile = 'Very reverberant space';
                analysis.weaknesses.push('Excessive reverberation', 'Poor speech intelligibility');
                analysis.recommendations.push('Add absorptive treatment');
                analysis.suitability.recording = 3;
                analysis.suitability.mixing = 2;
            }
        }

        if (roomData.volume) {
            if (roomData.volume < 50) {
                analysis.recommendations.push('Consider bass trapping for small room modes');
                analysis.treatmentSuggestions.push('Corner bass traps', 'Membrane absorbers');
            } else if (roomData.volume > 500) {
                analysis.strengths.push('Good natural acoustics potential');
                analysis.suitability.listening = 8;
            }
        }

        return analysis;
    },

    // Test API connection
    testAPIConnection: async (apiConfig) => {
        const config = { ...window.AIUtils.defaultConfig, ...apiConfig };
        
        try {
            const testPrompt = 'Respond with: {"status": "connected", "model": "' + config.model + '"}';
            const response = await window.AIUtils.callAI(testPrompt, config);
            
            return {
                success: true,
                status: 'connected',
                model: config.model,
                response: response
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                details: error.stack
            };
        }
    },

    // Get available models for provider
    getAvailableModels: (provider) => {
        const models = {
            openrouter: [
                { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', description: 'Fast and efficient' },
                { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet', description: 'Balanced performance' },
                { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', description: 'Cost-effective' },
                { id: 'openai/gpt-4o', name: 'GPT-4o', description: 'Most capable' },
                { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B', description: 'Open source' }
            ],
            openai: [
                { id: 'gpt-4o', name: 'GPT-4o', description: 'Latest model' },
                { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Cost-effective' },
                { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'High performance' }
            ],
            anthropic: [
                { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', description: 'Most capable' },
                { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Fast and efficient' }
            ]
        };
        
        return models[provider] || [];
    },

    // Get provider configuration
    getProviderConfig: (provider) => {
        const configs = {
            openrouter: {
                baseURL: 'https://openrouter.ai/api/v1',
                keyPlaceholder: 'sk-or-v1-...',
                signupURL: 'https://openrouter.ai/keys',
                description: 'Access multiple AI models through one API'
            },
            openai: {
                baseURL: 'https://api.openai.com/v1',
                keyPlaceholder: 'sk-...',
                signupURL: 'https://platform.openai.com/api-keys',
                description: 'OpenAI\'s official API'
            },
            anthropic: {
                baseURL: 'https://api.anthropic.com/v1',
                keyPlaceholder: 'sk-ant-...',
                signupURL: 'https://console.anthropic.com/',
                description: 'Anthropic\'s Claude models'
            }
        };
        
        return configs[provider] || configs.openrouter;
    },

    // Estimate API cost
    estimateAPICost: (provider, model, inputTokens, outputTokens) => {
        // Rough estimates - actual costs may vary
        const pricing = {
            'anthropic/claude-3-haiku': { input: 0.25e-6, output: 1.25e-6 },
            'anthropic/claude-3-sonnet': { input: 3e-6, output: 15e-6 },
            'openai/gpt-4o-mini': { input: 0.15e-6, output: 0.6e-6 },
            'openai/gpt-4o': { input: 5e-6, output: 15e-6 },
            'meta-llama/llama-3.1-8b-instruct': { input: 0.18e-6, output: 0.18e-6 }
        };
        
        const modelPricing = pricing[model] || { input: 1e-6, output: 3e-6 };
        const cost = (inputTokens * modelPricing.input) + (outputTokens * modelPricing.output);
        
        return {
            cost: cost,
            costFormatted: `${cost.toFixed(6)}`,
            inputCost: inputTokens * modelPricing.input,
            outputCost: outputTokens * modelPricing.output
        };
    },

    // Count tokens (rough estimate)
    estimateTokens: (text) => {
        // Rough estimation: ~4 characters per token
        return Math.ceil(text.length / 4);
    },

    // Validate API configuration
    validateConfig: (config) => {
        const errors = [];
        
        if (!config.apiKey) {
            errors.push('API key is required');
        }
        
        if (!config.provider) {
            errors.push('Provider is required');
        }
        
        if (!config.model) {
            errors.push('Model is required');
        }
        
        if (config.maxTokens && (config.maxTokens < 100 || config.maxTokens > 8000)) {
            errors.push('Max tokens must be between 100 and 8000');
        }
        
        if (config.temperature && (config.temperature < 0 || config.temperature > 2)) {
            errors.push('Temperature must be between 0 and 2');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    },

    // Generate analysis report
    generateAnalysisReport: async (roomData, audioData, dspChain, apiConfig) => {
        const config = { ...window.AIUtils.defaultConfig, ...apiConfig };
        
        const prompt = `Generate a comprehensive acoustic analysis report in markdown format.

**INPUT DATA:**
Room: ${JSON.stringify(roomData, null, 2)}
Audio: ${JSON.stringify(audioData, null, 2)}
DSP Chain: ${JSON.stringify(dspChain, null, 2)}

**REQUIRED SECTIONS:**
1. Executive Summary
2. Room Acoustic Analysis
3. Frequency Response Analysis
4. DSP Processing Chain
5. Recommendations
6. Technical Specifications

Format as professional markdown report with clear headings and technical details.`;

        try {
            const response = await window.AIUtils.callAI(prompt, config);
            return {
                success: true,
                report: typeof response === 'string' ? response : response.report || JSON.stringify(response, null, 2)
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                fallback: window.AIUtils.generateBasicReport(roomData, audioData, dspChain)
            };
        }
    },

    // Generate basic report fallback
    generateBasicReport: (roomData, audioData, dspChain) => {
        const report = `# Acoustic Analysis Report

## Executive Summary
Analysis performed on ${new Date().toLocaleDateString()} for acoustic space with volume of ${roomData.volume?.toFixed(1)} m³.

## Room Characteristics
- **Dimensions**: ${roomData.dimensions?.width?.toFixed(1)}m × ${roomData.dimensions?.depth?.toFixed(1)}m × ${roomData.dimensions?.height?.toFixed(1)}m
- **RT60**: ${roomData.avgRT60?.toFixed(2)}s
- **Classification**: ${roomData.classification || 'Standard Room'}

## DSP Processing Chain
${dspChain.map((proc, i) => `${i + 1}. **${window.DSP_PROCESSORS[proc.type]?.name}**: ${proc.reasoning}`).join('\n')}

## Recommendations
- Regular calibration recommended
- Monitor room temperature and humidity
- Consider acoustic treatment if RT60 > 1.5s

Generated by Acoustic Space Analyzer AI Pro`;
        
        return report;
    },

    // Cache management for API responses
    cacheResponse: (key, response, ttl = 3600000) => { // 1 hour default
        const cacheData = {
            response: response,
            timestamp: Date.now(),
            ttl: ttl
        };
        
        try {
            const cache = JSON.parse(sessionStorage.getItem('ai_cache') || '{}');
            cache[key] = cacheData;
            
            // Clean old entries
            Object.keys(cache).forEach(cacheKey => {
                if (Date.now() - cache[cacheKey].timestamp > cache[cacheKey].ttl) {
                    delete cache[cacheKey];
                }
            });
            
            sessionStorage.setItem('ai_cache', JSON.stringify(cache));
        } catch (error) {
            console.warn('Failed to cache AI response:', error);
        }
    },

    getCachedResponse: (key) => {
        try {
            const cache = JSON.parse(sessionStorage.getItem('ai_cache') || '{}');
            const cacheData = cache[key];
            
            if (cacheData && Date.now() - cacheData.timestamp < cacheData.ttl) {
                return cacheData.response;
            }
        } catch (error) {
            console.warn('Failed to retrieve cached response:', error);
        }
        
        return null;
    },

    clearCache: () => {
        try {
            sessionStorage.removeItem('ai_cache');
        } catch (error) {
            console.warn('Failed to clear AI cache:', error);
        }
    }
};

console.log('AIUtils loaded with', Object.keys(window.AIUtils).length, 'functions');