// src/lib/api-client.js

/**
 * Chiama il modello AI (OpenRouter o Groq) per l'analisi acustica
 * @param {string} prompt - Il prompt da inviare all'AI
 * @param {Object} apiConfig - Configurazione API: provider, apiKey, model
 * @returns {Promise<Object>} Risposta JSON dall'AI
 */
export const callAI = async (prompt, apiConfig) => {
  const { provider, apiKey, model } = apiConfig;

  let url, headers, body;

  if (provider === 'openrouter') {
    url = 'https://openrouter.ai/api/v1/chat/completions';
    headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.href,
      'X-Title': 'Acoustic Analyzer AI'
    };
    body = {
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2000
    };
  } else if (provider === 'groq') {
    url = 'https://api.groq.com/openai/v1/chat/completions';
    headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };
    body = {
      model: 'llama3-70b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2000
    };
  } else {
    throw new Error('Provider not supported');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API error: ${response.status} ${response.statusText} - ${errorData.error?.message || ''}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No content in AI response');
  }

  // Estrai il JSON dal contenuto
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error('Failed to parse JSON from AI response:', e);
      throw new Error('Invalid JSON in AI response');
    }
  }

  throw new Error('No valid JSON found in AI response');
};