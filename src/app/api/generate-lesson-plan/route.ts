import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get form data from request
    const { standards, audience, time, subject, topic, objectives } = await request.json();
    
    // Verify OpenAI API key exists
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    // Create prompt for OpenAI
    const prompt = `
      Create a detailed and professional lesson plan for ${audience} about "${topic}" in ${subject}, lasting ${time}.
      Standards to address: ${standards}
      Learning objectives: ${objectives}
      
      Format the lesson plan with these sections:
      1. Overview (brief summary)
      2. Learning Objectives
      3. Standards Addressed
      4. Materials Needed
      5. Vocabulary
      6. Lesson Procedure:
         - Introduction/Hook (engaging start)
         - Direct Instruction
         - Guided Practice
         - Independent Practice
         - Closure
      7. Assessment Methods
      8. Differentiation Strategies
      9. Extensions
      10. References/Resources
      
      Format it professionally so it could be printed and used by a teacher. Use markdown formatting.
    `;

    // Make request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert educator with years of experience creating high-quality, standards-aligned lesson plans."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2500
      })
    });

    // Parse OpenAI response
    const data = await response.json();
    
    // Check for errors in OpenAI response
    if (data.error) {
      console.error("OpenAI API error:", data.error);
      return NextResponse.json(
        { error: "Error generating lesson plan with AI" },
        { status: 500 }
      );
    }

    // Extract lesson plan content
    const lessonPlan = data.choices[0].message.content;
    
    return NextResponse.json({ 
      lessonPlan,
      metadata: {
        standards,
        audience,
        time,
        subject,
        topic,
        objectives,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Error in lesson plan generation:", error);
    return NextResponse.json(
      { error: "Failed to generate lesson plan" },
      { status: 500 }
    );
  }
} 