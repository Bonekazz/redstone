import { LanguageModel } from 'ai';

export class AIFactory { 
  static createModel(provider: string, options: any) {
    const { apiKey, modelName } = options;

    const factories: Record<string, () => LanguageModel> = { 
      groq: () => "",
      google: () => "",
      openRouter: () => "",
      anthropic: () => ""
    }

    const factory = factories[provider];

    if (!factory) {
      throw new Error(`Provider [${provider}] not supported.`);
    }

    return factory();
  }
}