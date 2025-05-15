import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { grade, subject, subcategory, topic, tone } = await req.json();
    if (!grade || !subject || !topic || !tone) {
      return NextResponse.json({ result: "Missing required fields." }, { status: 400 });
    }
    const prompt = `Create a detailed, college-level lesson plan for a classroom teacher.\n\nGrade Level: ${grade}\nSubject: ${subject}\nSubcategory: ${subcategory || "N/A"}\nTopic: ${topic}\nTone: ${tone}\n\nUse this exact structure and formatting:\n\nI. Lesson Foundation\n\n* Standards (3 sample aligned standards)\n\n* Instructional Objective (clear measurable objective)\n\n* Focus Question\n\n* Formative Assessments (2–3 with correct answers)\n\n* Summative Assessments (essay and selected response questions with answers)\n\nII. Lesson Body\n\n* Bell Ringer\n* The Hook\n* Teaching Procedures — Include 2 full I Do / We Do / You Do cycles\n* Close It — Reteach + Summarize\n\nIII. Lesson Essentials\n\n* Differentiation (2–5 sentences)\n* Multimedia Assessment Notes\n* Materials and Technology List\n* References (2 citations in APA format)\n\nIV. Link It Extension Activity\n\n* New Standard / Objective / Focus Question\n* Student-friendly directions\n* Required materials\n* Example of activity\n* Rubric (at least 3 criteria)\n\nV. Reflection (30-point Self-Assessment format with Glows, Grows, and Goals — multiple complete sentences for each)\n\nOutput everything as Markdown-formatted text for rendering.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful lesson plan generator." },
        { role: "user", content: prompt },
      ],
      max_tokens: 1800,
      temperature: 0.7,
    });
    const result = completion.choices[0]?.message?.content || "No result.";
    return NextResponse.json({ result });
  } catch (err: any) {
    return NextResponse.json({ result: err.message || "Error generating lesson plan." }, { status: 500 });
  }
} 