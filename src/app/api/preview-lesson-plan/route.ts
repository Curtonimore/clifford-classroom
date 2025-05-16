import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const {
    subject, subcategories, grade, topic, lessonTitle, notes, state,
    customStandards, customObjectives, customDifferentiation, customExtensions
  } = body;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing OpenAI API key" }, { status: 500 });
  }

  // Build the lesson plan prompt
  const title = lessonTitle || topic;
  let prompt = `You are a professional lesson plan generator for teachers. Write a detailed, standards-aligned lesson plan following this exact format:\n\n`;
  prompt += `Title: ${title}\nGrade: ${grade}\nSubject: ${subject}\nSubtopic(s): ${subcategories?.join(", ")}\n`;
  if (state) {
    prompt += `\nAlign all standards to the state of ${state}.`;
  }
  prompt += `\n\nObjectives:\n`;
  prompt += customObjectives ? customObjectives + "\n" : '[Write 2-3 clear, measurable objectives in "Students will be able to..." format, aligned with the selected subject and subcategories.]\n';
  prompt += `\nStandards:\n`;
  prompt += customStandards ? customStandards + "\n" : '[Include relevant Common Core, NGSS, or state standards codes and descriptions that align with the lesson objectives.]\n';
  prompt += `\nMaterials:\n[List all required physical and digital materials, including any technology or resources needed.]\n`;
  prompt += `\nAnticipatory Set:\n[Design an engaging 5-10 minute hook or warm-up activity that connects to prior knowledge and introduces the lesson topic.]\n`;
  prompt += `\nI Do (Direct Instruction):\n[Provide detailed, step-by-step teacher-led instruction, including key points, examples, and explanations.]\n`;
  prompt += `\nWe Do (Guided Practice):\n[Outline collaborative activities where teacher and students work together to apply new concepts.]\n`;
  prompt += `\nYou Do (Independent Practice):\n[Describe student-led activities that allow for individual application of learning.]\n`;
  prompt += `\nAssessment:\n[Specify how student understanding will be measured, including both formative and summative assessments.]\n`;
  prompt += `\nDifferentiation:\n`;
  prompt += customDifferentiation ? customDifferentiation + "\n" : '[Provide specific accommodations for struggling learners and extensions for advanced students.]\n';
  prompt += `\nExtensions:\n`;
  prompt += customExtensions ? customExtensions + "\n" : '[Provide optional extension activities for students who finish early or need more challenge.]\n';
  prompt += `\nNotes:\n${notes || "N/A"}\n`;
  prompt += `\nFormat the output as plain text with clear section headers. Do not use markdown or HTML. Focus on creating a practical, classroom-ready lesson plan that follows best practices in education.`;

  try {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert educator and curriculum designer, skilled at creating detailed, standards-aligned lesson plans that follow best practices in teaching and learning."
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });
    const data = await completion.json();
    const lessonText = data.choices?.[0]?.message?.content || "No lesson generated.";
    return NextResponse.json({ lessonText });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Failed to generate lesson plan." }, { status: 500 });
  }
} 