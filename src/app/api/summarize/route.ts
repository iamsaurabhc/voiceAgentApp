import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  const { messages } = await request.json();
  
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "Summarize the following conversation in a brief, concise manner."
      },
      {
        role: "user",
        content: messages.map((m: { sender: string; text: string }) => `${m.sender}: ${m.text}`).join('\n')
      }
    ]
  });

  return NextResponse.json({ summary: completion.choices[0].message.content });
} 