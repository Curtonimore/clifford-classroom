import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// Initialize Anthropic client with the correct API key format
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

const getCommonCoreStandards = (grade: string, subject: string) => {
  // This is a simplified example. In a real application, you would have a more comprehensive database of standards.
  if (subject === 'Math') {
    return `CCSS.Math.Content.${grade}.OA - Operations & Algebraic Thinking
CCSS.Math.Content.${grade}.NBT - Number & Operations in Base Ten
CCSS.Math.Content.${grade}.MD - Measurement & Data
CCSS.Math.Content.${grade}.G - Geometry`
  }
  if (subject === 'English') {
    return `CCSS.ELA-Literacy.${grade}.RL - Reading Literature
CCSS.ELA-Literacy.${grade}.RI - Reading Informational Text
CCSS.ELA-Literacy.${grade}.W - Writing
CCSS.ELA-Literacy.${grade}.SL - Speaking & Listening`
  }
  // Add more subjects as needed
  return 'Standard curriculum objectives will be used.'
}

export async function POST(request: Request) {
  try {
    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured. Please check your environment variables.' },
        { status: 500 }
      )
    }

    // Parse request body
    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { 
      grade, 
      subject, 
      subtopics, 
      objectives, 
      standards, 
      materials, 
      extensions, 
      customization, 
      duration 
    } = body

    // Validate required fields
    if (!grade || !subject || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields: grade, subject, and duration are required' },
        { status: 400 }
      )
    }

    // Extract duration number for time calculations
    const durationMinutes = parseInt(duration.split(' ')[0])
    if (isNaN(durationMinutes)) {
      return NextResponse.json(
        { error: 'Invalid duration format' },
        { status: 400 }
      )
    }

    // First, get a creative title
    const titlePrompt = `Create a creative and engaging title for a ${grade === 'K' ? 'Kindergarten' : `Grade ${grade}`} ${subject} lesson plan.
    ${subtopics && subtopics.length > 0 ? `The lesson focuses on: ${subtopics.join(', ')}` : ''}
    ${customization ? `The lesson should incorporate: ${customization}` : ''}
    Return only the title, nothing else.`

    const titleCompletion = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 100,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: titlePrompt
        }
      ]
    }).catch(error => {
      console.error('Error generating title:', error)
      throw new Error('Failed to generate lesson plan title')
    })

    const title = titleCompletion.content[0].type === 'text' 
      ? titleCompletion.content[0].text.trim()
      : `${subject} Lesson Plan`

    // Then, generate the full lesson plan
    const prompt = `Create a detailed lesson plan with the following title: "${title}"

    CORE REQUIREMENTS:
    1. Learning Objectives: ${objectives ? `${objectives}
    Transform these objectives into clear, measurable goals using specific action verbs (e.g., "analyze", "create", "evaluate") and define success criteria.
    Every activity in this lesson must directly support these objectives.` : 'Create clear, measurable learning objectives using specific action verbs and define success criteria. All activities must align with these objectives.'}

    2. Time Management (${duration} class period):
    - Introduction/Hook: ${Math.round(durationMinutes * 0.15)} minutes - Engage students and connect to prior knowledge
    - Main Activity: ${Math.round(durationMinutes * 0.4)} minutes - Core learning aligned with objectives
    - Guided Practice: ${Math.round(durationMinutes * 0.25)} minutes - Structured application of learning
    - Independent Practice: ${Math.round(durationMinutes * 0.2)} minutes - Individual demonstration of mastery
    Each section must include specific timing for sub-activities to ensure proper pacing.

    CONTEXT:
    - Grade Level: ${grade === 'K' ? 'Kindergarten' : `Grade ${grade}`}
    - Subject: ${subject}
    ${subtopics && subtopics.length > 0 ? `- Focus Topics: ${subtopics.join(', ')}` : ''}

    STANDARDS AND MATERIALS:
    ${standards ? `Teaching Standards: ${standards}` : `Recommended Common Core Standards:
    ${getCommonCoreStandards(grade, subject)}`}
    
    ${materials ? `Materials Needed: ${materials}` : 'Include a detailed list of required materials, ensuring each activity is properly resourced.'}
    
    ${customization ? `CUSTOMIZATION REQUESTS:
    ${customization}
    Integrate these elements while maintaining focus on core learning objectives.` : ''}

    Please provide a comprehensive lesson plan with the following sections:
    # ${title}
    # Lesson Overview (Brief summary aligned with objectives)
    # Learning Objectives (Specific, measurable goals with success criteria)
    # Materials Needed (Detailed list with quantities)
    # Introduction/Hook (${Math.round(durationMinutes * 0.15)} minutes)
    # Main Activity (${Math.round(durationMinutes * 0.4)} minutes)
    # Guided Practice (${Math.round(durationMinutes * 0.25)} minutes)
    # Independent Practice (${Math.round(durationMinutes * 0.2)} minutes)
    # Assessment/Exit Ticket (Must directly measure objective mastery)
    ${extensions ? `# Extensions/Modifications: ${extensions}` : '# Extensions/Modifications (Include both support and enrichment options)'}
    # Recommended Common Core Standards
    # Homework/Follow-up (If applicable, must reinforce objectives)

    CRITICAL REQUIREMENTS:
    1. Every activity must directly support the learning objectives
    2. Include specific timing for all activities and transitions
    3. Ensure activities are grade-appropriate and engaging
    4. Include formative assessment throughout
    5. Format each section with a # before the heading for PDF formatting
    6. Use professional language while incorporating any customization requests naturally`

    const completion = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    }).catch(error => {
      console.error('Error generating lesson plan:', error)
      throw new Error('Failed to generate lesson plan content')
    })

    // Get the content from the response
    const lessonPlan = completion.content[0].type === 'text' 
      ? completion.content[0].text 
      : 'Error: Unable to generate lesson plan'

    if (!lessonPlan || lessonPlan === 'Error: Unable to generate lesson plan') {
      throw new Error('Failed to generate lesson plan content')
    }

    return NextResponse.json({ 
      lessonPlan,
      title,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    })
  } catch (error: any) {
    console.error('Error generating lesson plan:', error)
    return NextResponse.json(
      { 
        error: error?.message || 'An unexpected error occurred while generating the lesson plan' 
      },
      { status: error?.status || 500 }
    )
  }
} 