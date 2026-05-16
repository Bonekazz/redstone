import { convertToModelMessages, streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';

export async function POST(req: Request) {
  const { messages, context } = await req.json();

  console.log("> CONTEXT PROVIDED: ", context);

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Defina GROQ_API_KEY no servidor ou userApiKey no cliente." },
      { status: 401 }
    );
  }

  const groq = createGroq({
    apiKey,
  });

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    ...(context && { system: `The user provided these messages data as context: ${JSON.stringify(context)}`}),
    prompt: await convertToModelMessages(messages),
    onFinish({text }) {
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