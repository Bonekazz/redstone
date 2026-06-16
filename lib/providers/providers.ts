export interface ProviderConfig {
  name: string;
  defaultModel: string;
  models: string[];
  requiresBaseUrl: boolean;
  placeholderUrl?: string;
}

export const AI_PROVIDERS: Record<string, ProviderConfig> = {
//   openai: {
//     name: 'OpenAI',
//     defaultModel: 'gpt-4o-mini',
//     models: ['gpt-4o-mini', 'gpt-4o', 'o1-mini', 'o3-mini'],
//     requiresBaseUrl: false,
//   },
//   anthropic: {
//     name: 'Anthropic (Claude)',
//     defaultModel: 'claude-3-5-sonnet-latest',
//     models: ['claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest', 'claude-3-opus-latest'],
//     requiresBaseUrl: false,
//   },
//   deepseek: {
//     name: 'DeepSeek',
//     defaultModel: 'deepseek-chat',
//     models: ['deepseek-chat', 'deepseek-reasoner'],
//     requiresBaseUrl: false,
//   },
  google: {
    name: 'Google (Gemini)',
    defaultModel: 'gemini-2.5-flash',
    models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash-thinking-exp'],
    requiresBaseUrl: false,
  },
  openrouter: {
    name: 'OpenRouter',
    defaultModel: 'meta-llama/llama-3.3-70b-instruct:free',
    models: [],
    requiresBaseUrl: false,
    placeholderUrl: 'https://openrouter.ai',
  },
  groq: {
    name: 'Groq',
    defaultModel: 'llama3-8b-8192',
    models: [
      'llama-3.3-70b-versatile', 
      'llama3-8b-8192', 
      'gemma2-9b-it', 
      'mixtral-8x7b-32768'
    ],
    requiresBaseUrl: false,
    placeholderUrl: 'https://groq.com',
  },
  custom: {
    name: 'Custom',
    defaultModel: '',
    models: [],
    requiresBaseUrl: true,
    placeholderUrl: 'https://groq.com',
  },
};