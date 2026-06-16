import { z } from 'zod';

export const aiFormSchema = z.object({
  provider: z.enum(["google", "openrouter", "groq", 'custom']),
  apiKey: z.string().min(1, 'A chave de API é obrigatória'),
  baseUrl: z.string().optional(),
  model: z.string().min(1, 'O modelo é obrigatório'),
}).superRefine((data, ctx) => {
  // SE o provedor for 'custom' E a URL estiver vazia, gera um erro na tela
  if (data.provider === 'custom' && (!data.baseUrl || data.baseUrl.trim() === '')) {
    ctx.addIssue({
      code: "custom",
      path: ['baseUrl'],
      message: 'A Base URL é obrigatória para provedores customizados',
    });
  }
});

// Extrai o tipo TypeScript gerado automaticamente pelo Schema do Zod
export type AIFormValues = z.infer<typeof aiFormSchema>;
