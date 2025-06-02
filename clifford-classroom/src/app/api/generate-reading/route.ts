import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { title, paragraphCount, generalTopic } = await req.json();

    if (!title || !paragraphCount || !generalTopic) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Generate a short reading passage.' },
          { role: 'user', content: `Title: ${title}, Topic: ${generalTopic}, Paragraphs: ${paragraphCount}` },
        ],
      }),
    });

    if (!openaiResponse.ok) {
      return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
    }

    const data = await openaiResponse.json();
    const content = data.choices[0].message.content;

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
} 