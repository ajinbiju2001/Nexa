const OpenAI = require('openai');

function isFreeModeEnabled() {
  return String(process.env.NEXA_FREE_MODE || '').toLowerCase() === 'true';
}

function getProvider() {
  return String(process.env.NEXA_AI_PROVIDER || '').trim().toLowerCase() || 'auto';
}

function getClient() {
  const provider = getProvider();

  if (isFreeModeEnabled() || provider === 'ollama') {
    return null;
  }

  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

function buildFallbackScript(videoIdea) {
  const cleanedIdea = String(videoIdea || 'this idea').trim().replace(/\s+/g, ' ');
  const shortIdea = cleanedIdea.slice(0, 120);

  return [
    `Hook: Stop scrolling. Here's the smartest part about ${shortIdea}.`,
    `Beat 1: Most people overcomplicate it, but the real win is using one clear idea people understand instantly.`,
    `Beat 2: When you turn that into short, punchy content, watch time goes up and the message lands faster.`,
    `Beat 3: That's exactly how creators turn simple topics into high-performing short videos.`,
    `Payoff: Follow Nexa for more AI-powered content ideas you can turn into videos fast.`,
  ].join('\n\n');
}

function getScriptPrompt(videoIdea) {
  return [
    'You write punchy 30-second YouTube Shorts scripts.',
    'Return only the final script.',
    'Keep it concise, high-retention, easy to narrate, and structured with a hook, 2-3 short beats, and a closing payoff.',
    `Create a 30-second YouTube Shorts script for this idea: ${videoIdea}`,
  ].join('\n');
}

async function generateWithOllama(videoIdea) {
  const endpoint = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
  const model = process.env.OLLAMA_MODEL || 'llama3.2:3b';

  const response = await fetch(`${endpoint}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      prompt: getScriptPrompt(videoIdea),
      stream: false,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama request failed with ${response.status}: ${text || 'unknown error'}`);
  }

  const payload = await response.json();
  const script = payload.response && String(payload.response).trim();

  if (!script) {
    throw new Error('Ollama did not return script text.');
  }

  return {
    script,
    provider: 'ollama',
    warning: null,
  };
}

async function generateShortScript(videoIdea) {
  const client = getClient();
  const provider = getProvider();
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

  if (provider === 'ollama') {
    try {
      return await generateWithOllama(videoIdea);
    } catch (error) {
      return {
        script: buildFallbackScript(videoIdea),
        provider: 'fallback',
        warning: `Ollama is enabled but unavailable, so Nexa returned a local demo script instead. ${error.message}`,
      };
    }
  }

  if (!client) {
    const freeMode = isFreeModeEnabled() || provider === 'auto';

    return {
      script: buildFallbackScript(videoIdea),
      provider: 'fallback',
      warning: freeMode
        ? 'Free mode is enabled. Nexa is using the built-in local script generator.'
        : 'OPENAI_API_KEY is missing. Returning a local demo script so the flow still works.',
    };
  }

  try {
    const response = await client.responses.create({
      model,
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'input_text',
              text: 'You write punchy 30-second YouTube Shorts scripts. Return only the final script. Keep it concise, high-retention, easy to narrate, and structured with a hook, 2-3 short beats, and a closing payoff.',
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: `Create a 30-second YouTube Shorts script for this idea: ${videoIdea}`,
            },
          ],
        },
      ],
    });

    const script = response.output_text && response.output_text.trim();
    if (!script) {
      throw new Error('OpenAI did not return script text.');
    }

    return {
      script,
      provider: 'openai',
      warning: null,
    };
  } catch (error) {
    return {
      script: buildFallbackScript(videoIdea),
      provider: 'fallback',
      warning: `OpenAI request failed, so Nexa returned a local demo script instead. ${error.message}`,
    };
  }
}

module.exports = {
  generateShortScript,
};
