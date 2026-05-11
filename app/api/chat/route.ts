import { convertToModelMessages, streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';

export async function POST(req: Request) {
  const { messages, nodeId } = await req.json();
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
    messages: await convertToModelMessages(messages),
    onFinish({text}) {
      console.log(text);
    },
  });

  return result.toUIMessageStreamResponse({
    messageMetadata: ({ part }) => {
      if (part.type === "start") return { nodeId }
    }
  })
}