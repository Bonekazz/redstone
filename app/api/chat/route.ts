import { z } from "zod";
import { convertToModelMessages, streamText } from "ai";
import { createGroq } from "@ai-sdk/groq";

const GroqModelSchema = z.enum(["llama-3.3-70b-versatile"]);

const requestSchema = z.object({
  modelProvider: z.literal("groq"),
  messages: z.array(z.any()),
  context: z.any().optional(),
  apiKey: z.string().min(1),
  model: GroqModelSchema,
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parseResult = requestSchema.safeParse(body);

  if (!parseResult.success) {
    return Response.json(
      { error: "Dados de requisição inválidos.", issues: parseResult.error.format() },
      { status: 400 }
    );
  }

  const { messages, context, apiKey, model } = parseResult.data;

  const groq = createGroq({ apiKey });
  const selectedModel = groq(model);

  const result = streamText({
    model: selectedModel,
    ...(context && { system: `The user provided these messages data as context: ${JSON.stringify(context)}` }),
    prompt: await convertToModelMessages(messages),
    onFinish({ text }) {
      console.log(text);
    },
  });

  const usage = await result.usage;

  return result.toUIMessageStreamResponse({
    messageMetadata: () => {
      return {
        usage
      }
    }
  })
}