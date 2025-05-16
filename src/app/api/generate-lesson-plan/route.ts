import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";

// 🎯 GOAL: Build a serverless function that receives lesson plan info from user input,
// sends a prompt to GPT-3.5 using OpenAI API, and returns a downloadable .txt file
// with the response formatted like CliffordClassroom.com lesson plans.

// Helper to create a filename from the title
function createFilename(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '_')         // Replace spaces with underscores
    .replace(/_+/g, '_')           // Replace multiple underscores with single
    .trim();
}

export async function POST(req: NextRequest) {
  // Only allow POST requests (Next.js API routes handle this by method export)

  // Parse JSON body
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { subject, subcategories, grade, topic, notes } = body;

  // Check for API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing OpenAI API key" }, { status: 500 });
  }

  // Build the lesson plan prompt
  const prompt = `
You are a professional lesson plan generator for teachers. Write a detailed, standards-aligned lesson plan following this exact format:

Title: ${topic}
Grade: ${grade}
Subject: ${subject}
Subtopic(s): ${subcategories.join(", ")}

Objectives:
[Write 2-3 clear, measurable objectives in "Students will be able to..." format, aligned with the selected subject and subcategories.]

Standards:
[Include relevant Common Core, NGSS, or state standards codes and descriptions that align with the lesson objectives.]

Materials:
[List all required physical and digital materials, including any technology or resources needed.]

Anticipatory Set:
[Design an engaging 5-10 minute hook or warm-up activity that connects to prior knowledge and introduces the lesson topic.]

I Do (Direct Instruction):
[Provide detailed, step-by-step teacher-led instruction, including key points, examples, and explanations.]

We Do (Guided Practice):
[Outline collaborative activities where teacher and students work together to apply new concepts.]

You Do (Independent Practice):
[Describe student-led activities that allow for individual application of learning.]

Assessment:
[Specify how student understanding will be measured, including both formative and summative assessments.]

Differentiation:
[Provide specific accommodations for struggling learners and extensions for advanced students.]

Notes:
${notes || "N/A"}

Format the output as plain text with clear section headers. Do not use markdown or HTML. Focus on creating a practical, classroom-ready lesson plan that follows best practices in education.
`;

  try {
    // Call OpenAI API using fetch
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

    // Parse the lesson text into sections
    const sections = lessonText.split('\n\n').filter(Boolean);
    const title = sections[0].replace('Title: ', '').trim();

    // Build the docx content
    const children = [
      // Title
      new Paragraph({
        children: [
          new TextRun({
            text: title,
            bold: true,
            size: 36, // 18pt
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
      // Add the rest of the sections
      ...sections.slice(1).map((section: string) => {
        const [header, ...content] = section.split('\n');
        return [
          // Section header
          new Paragraph({
            children: [
              new TextRun({
                text: header.replace(':', ''),
                bold: true,
                color: "004225", // Dark green
                size: 28, // 14pt
              }),
            ],
            spacing: { before: 400, after: 200 },
          }),
          // Section content
          new Paragraph({
            children: [
              new TextRun({
                text: content.join('\n'),
                size: 24, // 12pt
              }),
            ],
            spacing: { after: 200 },
          }),
        ];
      }).flat(),
    ];

    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: "Average, Times New Roman, serif",
              size: 24, // 12pt
            },
          },
        },
      },
      sections: [{ properties: {}, children }],
    });

    // Generate the document buffer
    const buffer = await Packer.toBuffer(doc);
    
    // Create filename from title
    const filename = `${createFilename(title)}.docx`;

    // Return as downloadable .docx file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename=\"${filename}\"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Failed to generate lesson plan." }, { status: 500 });
  }
} 