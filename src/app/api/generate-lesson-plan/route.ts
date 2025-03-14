import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Sample lesson plans for different subjects
export const SAMPLE_LESSON_PLANS = {
  mathematics: `# Fractions Lesson Plan: Understanding Equivalent Fractions

## Overview
This lesson introduces students to the concept of equivalent fractions through visual models, manipulatives, and real-world examples. Students will learn to identify, create, and use equivalent fractions.

## Learning Objectives
- Identify equivalent fractions using visual models
- Generate equivalent fractions by multiplying the numerator and denominator by the same number
- Compare fractions with different denominators using equivalent fractions
- Apply equivalent fractions to solve real-world problems

## Standards Addressed
- CCSS.MATH.CONTENT.4.NF.A.1: Explain why a fraction a/b is equivalent to a fraction (n × a)/(n × b) by using visual fraction models.

## Materials Needed
- Fraction strips/circles
- Colored paper for fraction models
- Scissors
- Whiteboard and markers
- Student worksheets
- Interactive whiteboard or document camera
- Fraction dice (optional)
- Fraction games (optional)

## Vocabulary
- Fraction
- Numerator
- Denominator
- Equivalent
- Simplify
- Lowest terms
- Common factor

## Lesson Procedure

### Introduction/Hook (10 minutes)
1. Begin by showing students a chocolate bar divided into 2 equal parts, with 1 part shaded.
2. Ask: "What fraction of the chocolate bar is shaded?" (1/2)
3. Now show the same chocolate bar divided into 4 equal parts, with 2 parts shaded.
4. Ask: "What fraction is shaded now?" (2/4)
5. Ask: "Do these two models show the same amount of chocolate? How can that be if the fractions look different?"
6. Introduce the concept of equivalent fractions as different fractions that represent the same amount.

### Direct Instruction (15 minutes)
1. Define equivalent fractions as fractions that name the same amount or have the same value.
2. Demonstrate using visual models (fraction strips/circles) to show equivalent fractions.
3. Show how to generate equivalent fractions by multiplying both the numerator and denominator by the same non-zero number.
4. Model several examples:
   - 1/2 = (1 × 2)/(2 × 2) = 2/4
   - 1/3 = (1 × 2)/(3 × 2) = 2/6
   - 2/3 = (2 × 3)/(3 × 3) = 6/9
5. Explain why this works using area models.

### Guided Practice (15 minutes)
1. Provide students with fraction strips or circles.
2. Guide students to create their own equivalent fraction models.
3. Have students work in pairs to find equivalent fractions for 1/4, 2/3, and 3/4.
4. As a class, create an equivalent fraction chart, noting patterns.
5. Solve problems together:
   - If 3/4 of the class likes pizza, what fraction in eighths would that be?
   - If 1/2 of a pizza is left, how could we write this with a denominator of 6?

### Independent Practice (15 minutes)
1. Students complete a worksheet with equivalent fraction problems:
   - Finding equivalent fractions
   - Determining if fractions are equivalent
   - Writing fractions in lowest terms
   - Solving word problems involving equivalent fractions
2. Students can use their fraction models to help them solve the problems.

### Closure (5 minutes)
1. Ask students to explain how they know if two fractions are equivalent.
2. Have students share one thing they learned about equivalent fractions.
3. Exit ticket: Students write three fractions that are equivalent to 2/5.

## Assessment Methods
- Observation during guided and independent practice
- Exit ticket responses
- Worksheet completion and accuracy
- Student explanations of processes

## Differentiation Strategies
### For struggling students:
- Provide additional visual models and manipulatives
- Focus on visual representations before moving to algorithms
- Work with simpler fractions (halves, fourths, eighths)

### For advanced students:
- Challenge with more complex fractions
- Extend to comparing and ordering fractions with different denominators
- Introduce decimal equivalents for fractions

## Extensions
- Create a fraction wall showing equivalent fractions
- Design a game where students match equivalent fractions
- Apply equivalent fractions to cooking measurements or other real-world contexts
- Explore the relationship between fractions and decimals

## References/Resources
- National Council of Teachers of Mathematics: www.nctm.org
- Illuminations Resources for Teaching Math: https://illuminations.nctm.org/
- Khan Academy: Equivalent Fractions
- Van de Walle, J. A., Karp, K. S., & Bay-Williams, J. M. (2018). Elementary and Middle School Mathematics: Teaching Developmentally (10th ed.)`,
  
  science: `# Properties of Matter Lesson Plan

## Overview
This lesson will introduce students to the basic properties of matter. Students will explore how matter can be described and classified based on observable properties such as color, texture, hardness, and state of matter. Through hands-on investigations, students will develop understanding of how scientists describe and categorize materials.

## Learning Objectives
- Identify and describe physical properties of matter
- Distinguish between the three states of matter: solid, liquid, and gas
- Classify objects based on their observable properties
- Conduct simple investigations to test properties of different materials
- Record observations and measurements using appropriate tools

## Standards Addressed
- NGSS 2-PS1-1: Plan and conduct an investigation to describe and classify different kinds of materials by their observable properties.
- NGSS 2-PS1-2: Analyze data obtained from testing different materials to determine which materials have the properties that are best suited for an intended purpose.

## Materials Needed
- Collection of various objects made from different materials (wood, metal, plastic, fabric, etc.)
- Magnifying glasses
- Balance scales
- Measuring tools (rulers, measuring cups)
- Water and containers
- Sorting trays
- Student notebooks/science journals
- Properties of Matter anchor chart
- "Material Property Cards" with descriptive terms
- Sorting worksheet

## Vocabulary
- Matter
- Property
- Solid
- Liquid
- Gas
- Texture
- Weight
- Flexible
- Rigid
- Transparent
- Opaque
- Buoyancy

## Lesson Procedure

### Introduction/Hook (10 minutes)
1. Begin by displaying a "mystery bag" containing various objects made of different materials.
2. Invite 3-4 students to reach into the bag (without looking) and describe what they feel.
3. Ask: "How did you describe the objects? What words did you use?"
4. Record descriptive words on the board.
5. Introduce the lesson focus: "Today we're going to learn about the properties of matter - the characteristics that help us describe and identify different materials."

### Direct Instruction (15 minutes)
1. Introduce the concept of "matter" as anything that takes up space and has mass.
2. Explain that matter has properties that help us describe and identify it.
3. Present the "Properties of Matter" anchor chart with categories:
   - Color
   - Texture (smooth, rough, bumpy)
   - Hardness (soft, hard)
   - Flexibility (rigid, bendable)
   - State (solid, liquid, gas)
   - Transparency (clear, opaque, translucent)
   - Buoyancy (floats or sinks)
4. Demonstrate how to observe and describe a few sample objects using these properties.
5. Explain how scientists use properties to sort materials into groups.

### Guided Practice (20 minutes)
1. Divide students into small groups.
2. Provide each group with a tray of 5-6 different objects.
3. Guide students through the process of observing and recording properties:
   - What color is it?
   - How does it feel? (texture)
   - Does it bend or is it rigid?
   - Is it hard or soft?
   - Can you see through it?
4. Have groups share their observations with the class.
5. Guide students to sort their objects based on one property (e.g., all flexible items together).

### Independent Practice (25 minutes)
1. Set up 4 investigation stations:
   - Station 1: Sorting by texture and hardness
   - Station 2: Testing transparency (flashlights provided)
   - Station 3: Testing buoyancy in water
   - Station 4: Comparing weight using balance scales
2. Students rotate through stations in their groups.
3. At each station, students perform the investigation and record their findings in their science journals.
4. Students complete a "Properties Sorting Worksheet" where they classify objects based on multiple properties.

### Closure (10 minutes)
1. Gather students back together.
2. Ask: "Why is it important for scientists to observe properties of matter?"
3. Discuss: "How do the properties of an object help determine how it can be used?"
4. Have students share one interesting discovery they made during the stations.
5. Preview tomorrow's lesson: "Tomorrow we'll explore how we can use properties to determine which materials are best for specific purposes."

## Assessment Methods
- Observations of student participation at investigation stations
- Completion of properties sorting worksheet
- Science journal entries with property descriptions
- Exit ticket: "Name three properties of matter and give an example of each"

## Differentiation Strategies
### For struggling students:
- Provide a word bank of descriptive terms
- Include visual supports on the worksheet
- Partner with a peer mentor
- Focus on fewer properties at a time

### For advanced students:
- Encourage more detailed observations and measurements
- Add quantitative properties (measure mass, volume)
- Challenge to identify multiple ways to classify objects
- Investigate how properties can change under different conditions

## Extensions
- Design and conduct a "mystery material" identification challenge
- Research how specific properties make materials suitable for certain uses (e.g., why are pots and pans made of metal?)
- Explore how materials with certain properties are used in the school building
- Investigate how some materials can change states (solid to liquid, etc.)

## References/Resources
- National Science Teachers Association: www.nsta.org
- Mystery Science: Properties of Materials unit
- "Matter: See It, Touch It, Taste It, Smell It" by Darlene R. Stille
- AIMS Education Foundation: Matter and Energy activities`,
  
  language_arts: `# Persuasive Writing Lesson Plan: Creating Convincing Arguments

## Overview
This lesson helps students understand and apply the elements of persuasive writing. Students will learn how to form strong opinions, organize their arguments logically, and use persuasive language techniques to convince their audience.

## Learning Objectives
- Identify the purpose and features of persuasive writing
- Formulate clear opinion statements supported by reasons and evidence
- Organize a persuasive text with logical structure (introduction, body, conclusion)
- Use persuasive language including emotive words, rhetorical questions, and facts
- Consider audience and purpose when crafting persuasive arguments

## Standards Addressed
- CCSS.ELA-LITERACY.W.4.1: Write opinion pieces on topics or texts, supporting a point of view with reasons and information.
- CCSS.ELA-LITERACY.W.4.1.A: Introduce a topic or text clearly, state an opinion, and create an organizational structure.
- CCSS.ELA-LITERACY.W.4.1.B: Provide reasons supported by facts and details.

## Materials Needed
- Sample persuasive texts (advertisements, editorials, speeches)
- Persuasive writing graphic organizers
- Persuasive language word bank poster
- Chromebooks/tablets for research (optional)
- Chart paper and markers
- Student notebooks
- Persuasive writing checklist
- Selection of debate topics appropriate for age level

## Vocabulary
- Persuade
- Opinion
- Argument
- Evidence
- Reasons
- Fact vs. Opinion
- Audience
- Emotive language
- Rhetorical question
- Exaggeration
- Call to action
- Counterargument

## Lesson Procedure

### Introduction/Hook (10 minutes)
1. Display two short advertisements (print or video) for similar products.
2. Ask students: "Which product would you choose? Why?"
3. Guide discussion to reveal how the ads tried to persuade them.
4. Explain: "Today we're going to learn how writers persuade their readers to agree with their opinions or take specific actions."

### Direct Instruction (15 minutes)
1. Define persuasive writing as writing that attempts to convince the reader to agree with the writer's opinion.
2. Introduce the key elements of persuasive writing:
   - Clear opinion statement
   - Strong supporting reasons
   - Convincing evidence and examples
   - Organized structure
   - Persuasive language techniques
3. Model analyzing a sample persuasive text, highlighting:
   - How the author states their opinion
   - The reasons and evidence provided
   - The organization (introduction, body paragraphs, conclusion)
   - Persuasive language devices
4. Explain the OREO method for organizing arguments:
   - O - Opinion
   - R - Reasons
   - E - Evidence/Examples
   - O - Opinion restated

### Guided Practice (20 minutes)
1. Display a simple topic: "School lunches should include dessert every day."
2. Lead a class brainstorm of arguments for and against this opinion.
3. Together, complete a persuasive writing graphic organizer:
   - Opinion statement
   - 3 supporting reasons
   - Evidence for each reason
   - Counterarguments to address
   - Conclusion with call to action
4. Draft a persuasive paragraph together on chart paper, explicitly showing:
   - How to start with a hook and opinion statement
   - How to connect reasons with transition words
   - How to include persuasive language
   - How to end with a strong concluding statement

### Independent Practice (25 minutes)
1. Provide students with a choice of age-appropriate topics:
   - Should homework be eliminated?
   - Should students wear uniforms?
   - Should the school day be longer or shorter?
   - Should kids have their own smartphones?
2. Have students complete their own graphic organizers for their chosen topic.
3. Students draft a persuasive paragraph or short essay using their organizers.
4. Remind students to use the persuasive writing checklist to self-assess.

### Closure (10 minutes)
1. In pairs, have students share their persuasive pieces and provide feedback.
2. Ask volunteers to share one effective persuasive technique they used.
3. Discuss: "What makes a persuasive argument effective? What techniques did you find most convincing?"
4. Preview next lesson: "Tomorrow we'll revise our persuasive writing to make it even more convincing."

## Assessment Methods
- Completion of persuasive writing graphic organizer
- First draft of persuasive paragraph/essay
- Observation of student participation in discussions
- Self-assessment using persuasive writing checklist
- Exit ticket: "What are three techniques writers use to persuade readers?"

## Differentiation Strategies
### For struggling students:
- Provide sentence starters for opinion statements and reasons
- Offer a simplified graphic organizer
- Allow for oral planning before writing
- Provide a word bank of transition and persuasive words

### For advanced students:
- Challenge to address counterarguments in their writing
- Encourage use of more sophisticated persuasive techniques
- Assign a more complex topic requiring research
- Have them write for a specific target audience

## Extensions
- Hold a classroom debate using prepared persuasive arguments
- Analyze persuasive techniques in advertising and political speeches
- Write persuasive letters to the principal, school board, or local newspaper about a school or community issue
- Create persuasive multimedia presentations combining text, images, and sound

## References/Resources
- "I Wanna New Room" by Karen Kaufman Orloff (mentor text)
- "Hey, Little Ant" by Phillip and Hannah Hoose (mentor text)
- ReadWriteThink.org: Persuasive Writing resources
- The Writing Fix: Persuasive writing prompts and resources
- Time for Kids: Debate topics appropriate for elementary students`,

  social_studies: `# U.S. History Lesson Plan: Colonial America

## Overview
This lesson introduces students to the daily life, challenges, and cultural elements of Colonial America (1607-1776). Students will explore how colonists lived, worked, and interacted with their environment and with Native American populations. By examining primary sources and engaging in hands-on activities, students will gain a deeper understanding of early American history.

## Learning Objectives
- Compare and contrast daily life in different colonial regions (New England, Middle, Southern)
- Analyze how geography influenced colonial settlements and economic activities
- Describe the relationships between colonists and Native American groups
- Identify key historical figures and their contributions to colonial development
- Understand how colonial life laid the foundation for American culture and values

## Standards Addressed
- NCSS.D2.His.2.3-5: Compare life in specific historical time periods to life today
- NCSS.D2.His.14.3-5: Explain probable causes and effects of events and developments
- NCSS.D2.Geo.4.3-5: Explain how culture influences the way people modify and adapt to their environments

## Materials Needed
- Colonial America maps
- Primary source documents (simplified for grade level)
- Colonial artifact replicas or pictures
- Art supplies for colonial craft activities
- Role cards for colonial occupations
- Venn diagrams for comparison activities
- Student journals
- Interactive timeline materials
- Reading materials on colonial life

## Vocabulary
- Colony/Colonist
- Settlement
- Pilgrim
- Puritan
- Plantation
- Indentured servant
- Apprentice
- Trade
- Mercantilism
- Self-government
- Native American tribes (regional)
- Jamestown/Plymouth

## Lesson Procedure

### Introduction/Hook (15 minutes)
1. Display a "mystery box" containing colonial artifacts or replicas (quill pen, butter churn miniature, candle mold, etc.)
2. Have students guess what each item was used for in colonial times.
3. Ask: "How would your daily routine be different if you lived in the 1700s?"
4. Show a brief video clip depicting colonial village life.
5. Introduce the essential question: "How did where colonists lived affect how they lived?"

### Direct Instruction (20 minutes)
1. Using a large map, introduce the three colonial regions (New England, Middle, Southern).
2. Explain key characteristics of each region:
   - New England: rocky soil, shipbuilding, fishing, trade, small farms
   - Middle Colonies: fertile soil, "bread basket," religious diversity
   - Southern Colonies: large plantations, cash crops (tobacco, rice, indigo)
3. Discuss major colonial settlements and why they were established.
4. Present a timeline of significant colonial events (1607 Jamestown, 1620 Plymouth, etc.)
5. Explain how geography influenced colonial economies and daily life.

### Guided Practice (25 minutes)
1. Divide class into three groups, each representing a colonial region.
2. Provide each group with a regional information packet containing:
   - Regional map
   - Climate and geographical features
   - Major occupations
   - Housing styles
   - Cultural/religious information
3. Each group creates a poster highlighting key aspects of their assigned region.
4. Guide students in completing a "Colonial Life Chart" comparing aspects of life across regions:
   - Types of work
   - Education opportunities
   - Housing
   - Food
   - Religion

### Independent Practice (25 minutes)
1. Students rotate through four colonial life stations:
   - Station 1: Colonial Occupations (matching jobs with tools and products)
   - Station 2: Colonial Home Life (examining household items and responsibilities)
   - Station 3: Colonial Education (trying quill pen writing, hornbook reading)
   - Station 4: Colonial Maps (identifying settlements, resources, and trade routes)
2. At each station, students record information in their "Colonial America Journal"
3. Students complete a written reflection comparing colonial life to modern life.

### Closure (15 minutes)
1. Bring class together for a "Colonial Town Meeting"
2. Each student introduces themselves as a colonial character (occupation and region)
3. Discuss: "What were the biggest challenges colonists faced? How did they overcome them?"
4. Review the essential question: "How did where colonists lived affect how they lived?"
5. Preview next lesson: "Tomorrow we'll explore relations between colonists and Native Americans."

## Assessment Methods
- Colonial Life Chart completion
- Region poster accuracy and detail
- Station activity participation and journal entries
- Written reflection on colonial vs. modern life
- Exit ticket: "Name three ways geography affected colonial life"

## Differentiation Strategies
### For struggling students:
- Provide sentence frames for written responses
- Offer simplified reading materials with visual supports
- Partner with peer support
- Focus on concrete rather than abstract concepts

### For advanced students:
- Incorporate more complex primary source analysis
- Assign additional research on specific colonial figures
- Explore economic relationships between colonies and Britain
- Compare multiple perspectives on colonial events

## Extensions
- Colonial craft project (candle making, weaving, etc.)
- Create a colonial newspaper with student-written articles
- Design a colonial village layout with rationale
- Research local colonial history connections
- Role-play a colonial town meeting to solve a community problem

## References/Resources
- Library of Congress: Colonial America primary sources
- "If You Lived in Colonial Times" by Ann McGovern
- Colonial Williamsburg educational resources
- National Geographic Kids: Colonial America
- Jamestown Settlement and Plymouth Plantation virtual tours`
};

// Add a weather template specifically for rain and similar topics
const WEATHER_TEMPLATE = `# Weather and Water Cycle Lesson Plan

## Overview
This lesson introduces students to weather patterns and phenomena, focusing on the water cycle and rain formation. Students will observe, describe, and learn about rain through hands-on activities and discussions that are appropriate for their grade level.

## Learning Objectives
- Students will identify and describe how rain forms as part of the water cycle
- Students will understand the basic components of the water cycle: evaporation, condensation, and precipitation
- Students will learn about how rain affects our environment and daily lives
- Students will practice weather observation and recording skills

## Standards Addressed
- NGSS K-ESS2-1: Use and share observations of local weather conditions to describe patterns over time.
- NGSS K-ESS3-2: Ask questions to obtain information about the purpose of weather forecasting to prepare for, and respond to, severe weather.

## Materials Needed
- Weather picture cards
- Chart paper and markers
- Weather observation worksheets
- Clear plastic cups for water cycle demonstration

## Vocabulary
- Weather
- Rain
- Clouds
- Precipitation
- Water cycle
- Evaporation
- Condensation
- Weather forecast

## Lesson Procedure

### Introduction/Hook (10 minutes)
- Begin by asking students: "What's the weather like today? Has it rained recently?"
- Have students look outside and describe what they observe about the current weather
- Show pictures of rainy weather and discuss students' experiences with rain
- Introduce the focus: "Today we're going to learn about rain and where it comes from!"

### Direct Instruction (15 minutes)
- Explain the water cycle using simple terms and visuals appropriate for the grade level
- Demonstrate the water cycle using a clear cup with warm water and a cool plate
- Discuss how water evaporates, forms clouds, and falls as rain
- Show pictures of different types of clouds that produce rain
- Connect rain and the water cycle to students' everyday experiences

### Guided Practice (20 minutes)
- Create a class chart showing the water cycle with special focus on rain formation
- Have students act out the water cycle (starting as water, rising as vapor, forming clouds, falling as rain)
- Guide students in creating rain clouds in a jar using shaving cream and food coloring
- Observe and discuss how the "rain" falls in the demonstration

### Independent Practice (15 minutes)
- Students complete a simple water cycle worksheet with focus on the rain portion
- Students draw pictures showing what happens during rainy weather
- Students create a rain gauge to take home (using plastic bottles if available)
- Weather vocabulary matching activity focusing on rain-related terms

### Closure (5 minutes)
- Review the main parts of the water cycle with emphasis on rain formation
- Discuss: "Why is rain important for people, animals, and plants?"
- Preview next lesson: "Tomorrow we'll learn about other types of weather!"

## Assessment Methods
- Observation of student participation in discussions and activities
- Completion of water cycle worksheet
- Student drawings of rainy weather
- Exit ticket: "Where does rain come from?"

## Differentiation Strategies
- For struggling students: Provide visual supports and simplified vocabulary
- For advanced students: Explore more complex weather patterns and measurement

## Extensions
- Set up a classroom rain gauge to measure precipitation
- Create a classroom terrarium to observe the water cycle
- Learn about different types of storms and precipitation

## References/Resources
- National Weather Service Education Resources
- "The Water Cycle" by Rebecca Olien
- "Rain" by Marion Dane Bauer
`;

// Function to generate a demo lesson plan based on the subject
export function generateDemoLessonPlan(subject, audience, topic, time, standards, objectives, options, materials, notes) {
  // Choose the most appropriate template based on subject and topic
  console.log("Generating demo lesson plan for:", { subject, topic, audience, options });
  
  let lessonPlan = '';
  
  // Normalize inputs for comparison - convert to lowercase and trim
  const normalizedSubject = (subject || '').toLowerCase().trim();
  const normalizedTopic = (topic || '').toLowerCase().trim();
  
  // Fix options handling - handle both string and array cases
  let normalizedOptions: string[] = [];
  if (options) {
    if (Array.isArray(options)) {
      normalizedOptions = options.map(opt => String(opt).toLowerCase().trim());
    } else if (typeof options === 'string') {
      normalizedOptions = options.split(',').map(opt => opt.toLowerCase().trim());
    }
  }
  
  // Debug log
  console.log("Normalized values:", { 
    normalizedSubject, 
    normalizedTopic, 
    normalizedOptions
  });
  
  // Define topic matching function
  const containsAnyOf = (text, keywords) => {
    if (!text) return false;
    return keywords.some(keyword => text.includes(keyword));
  };
  
  // WEATHER DETECTION - Check for weather/water related keywords in topic and options
  const weatherKeywords = ['rain', 'weather', 'cloud', 'water cycle', 'climate', 'precipitation', 'storm', 'atmosphere', 'environment'];
  const environmentKeywords = ['environment', 'ecosystem', 'biome', 'habitat', 'conservation', 'earth science'];
  
  // Look for weather keywords in multiple fields
  const hasWeatherTopic = containsAnyOf(normalizedTopic, weatherKeywords);
  const hasWeatherOptions = normalizedOptions.some(opt => containsAnyOf(opt, weatherKeywords));
  const hasEarthScience = normalizedSubject.includes('earth science') || 
                          normalizedTopic.includes('earth science') ||
                          containsAnyOf(normalizedTopic, environmentKeywords) ||
                          normalizedOptions.some(opt => containsAnyOf(opt, environmentKeywords));
  
  console.log("Topic detection:", { 
    hasWeatherTopic, 
    hasWeatherOptions, 
    hasEarthScience,
    normalizedTopic,
    normalizedOptions
  });
  
  // If any weather indicators are found, use the weather template
  if (hasWeatherTopic || hasWeatherOptions || hasEarthScience) {
    console.log("Selected WEATHER template");
    lessonPlan = WEATHER_TEMPLATE;
  }
  // Otherwise, use subject-based templates
  else if (normalizedSubject.includes('math')) {
    console.log("Selected MATH template");
    lessonPlan = SAMPLE_LESSON_PLANS.mathematics;
  } else if (normalizedSubject.includes('science')) {
    console.log("Selected SCIENCE template");
    lessonPlan = SAMPLE_LESSON_PLANS.science;
  } else if (normalizedSubject.includes('language') || normalizedSubject.includes('english')) {
    console.log("Selected LANGUAGE ARTS template");
    lessonPlan = SAMPLE_LESSON_PLANS.language_arts;
  } else if (normalizedSubject.includes('social') || normalizedSubject.includes('history')) {
    console.log("Selected SOCIAL STUDIES template");
    lessonPlan = SAMPLE_LESSON_PLANS.social_studies;
  } else {
    // Default to a general template if no match
    console.log("No specific template match, using default");
    lessonPlan = SAMPLE_LESSON_PLANS.mathematics;
  }
  
  // Now, let's customize the lesson plan better for the specific topic
  // Extract grade level number (if present)
  let gradeLevel = 0;
  let gradeLevelText = audience || '';
  if (audience) {
    const gradeMatch = audience.match(/(\d+)/);
    if (gradeMatch) {
      gradeLevel = parseInt(gradeMatch[1]);
    } else if (audience.toLowerCase().includes('kindergarten')) {
      gradeLevel = 0;
    }
  }
  
  // Customize the lesson plan title and audience
  let customTitle = '';
  
  if (hasWeatherTopic || hasWeatherOptions || hasEarthScience) {
    // For weather lessons
    if (normalizedTopic.includes('rain')) {
      customTitle = `# Rain Lesson Plan for ${gradeLevelText}`;
    } else {
      customTitle = `# ${topic || 'Weather'} Lesson Plan for ${gradeLevelText}`;
    }
  } else {
    // For other subjects
    customTitle = `# ${topic || subject} Lesson Plan for ${gradeLevelText}`;
  }
  
  // Replace the original title
  lessonPlan = lessonPlan.replace(/^# .*$/m, customTitle);
  
  // Adjust difficulty based on grade level
  if (gradeLevel >= 0 && gradeLevel <= 12) {
    // Lower grade levels (K-2) - simplify language and examples
    if (gradeLevel <= 2) {
      lessonPlan = lessonPlan.replace(/complex concepts/gi, 'simple concepts');
      lessonPlan = lessonPlan.replace(/analyzing/gi, 'exploring');
      lessonPlan = lessonPlan.replace(/Students will analyze/gi, 'Students will explore');
    }
    // Upper elementary (3-5) - standard templates are usually targeted at this range
    // Middle school (6-8) - increase complexity
    else if (gradeLevel >= 6 && gradeLevel <= 8) {
      lessonPlan = lessonPlan.replace(/basic understanding/gi, 'deeper understanding');
      lessonPlan = lessonPlan.replace(/explore/gi, 'analyze');
    }
    // High school (9-12) - more advanced
    else if (gradeLevel >= 9) {
      lessonPlan = lessonPlan.replace(/explore/gi, 'critically analyze');
      lessonPlan = lessonPlan.replace(/simple/gi, 'complex');
    }
  }
  
  // Specific topic customization
  if (topic) {
    const normalizedTopic = topic.toLowerCase();
    
    // Customize based on subject+topic
    if (normalizedSubject === 'mathematics') {
      if (normalizedTopic.includes('geometry')) {
        lessonPlan = lessonPlan.replace(/fractions/gi, 'geometric shapes');
        lessonPlan = lessonPlan.replace(/equations/gi, 'spatial relationships');
      } else if (normalizedTopic.includes('number')) {
        lessonPlan = lessonPlan.replace(/fractions/gi, 'numbers');
        lessonPlan = lessonPlan.replace(/equivalent fractions/gi, 'number patterns');
      }
    }
    else if (normalizedSubject === 'language_arts') {
      if (normalizedTopic.includes('reading')) {
        lessonPlan = lessonPlan.replace(/writing/gi, 'reading');
        lessonPlan = lessonPlan.replace(/persuasive/gi, 'comprehension');
      }
    }
  }
  
  // 1. First handle custom standards if provided
  if (standards) {
    const standardsPattern = /## Standards Addressed\n([^#]*)/;
    const standardsMatch = lessonPlan.match(standardsPattern);
    
    if (standardsMatch) {
      let standardsSection = `- ${standards}\n`;
      
      // Replace the original standards section
      lessonPlan = lessonPlan.replace(standardsPattern, `## Standards Addressed\n${standardsSection}`);
    }
  }
  
  // 2. Handle custom objectives and options together
  const objectivesPattern = /## Learning Objectives\n([^#]*)/;
  const objectivesMatch = lessonPlan.match(objectivesPattern);
  
  if (objectivesMatch) {
    let objectivesSection = "";
    
    if (objectives) {
      // If custom objectives provided, use them as the base
      objectivesSection = `- ${objectives}\n`;
    } else {
      // Otherwise keep the template objectives
      objectivesSection = objectivesMatch[1];
    }
    
    // Add the selected options as additional objectives if provided
    if (options && options.length > 0) {
      objectivesSection += `- Focus on specific aspects: ${options}\n`;
    }
    
    // Replace the original objectives section
    lessonPlan = lessonPlan.replace(objectivesPattern, `## Learning Objectives\n${objectivesSection}`);
  }
  
  // 3. Add custom duration if provided
  if (time) {
    lessonPlan = lessonPlan.replace(
      /### Direct Instruction \((\d+) minutes\)/,
      `### Direct Instruction (adjusted for ${time})`
    );
  }
  
  // 4. Add materials section if provided
  if (materials) {
    // Find Materials Needed section
    const materialsPattern = /## Materials Needed\n([^#]*)/;
    const materialsMatch = lessonPlan.match(materialsPattern);
    
    if (materialsMatch) {
      // Replace the entire materials section with just the provided materials
      // Split the materials by commas or newlines for better formatting
      const materialsList = materials.split(/[,\n]+/).map(item => item.trim()).filter(item => item);
      let materialsSection = materialsList.map(item => `- ${item}`).join('\n') + '\n';
      
      // Replace the original materials section
      lessonPlan = lessonPlan.replace(materialsPattern, `## Materials Needed\n${materialsSection}`);
    } else {
      // If no Materials section exists, add one before Lesson Procedure
      const procedurePattern = /## Lesson Procedure/;
      
      // Split the materials by commas or newlines for better formatting
      const materialsList = materials.split(/[,\n]+/).map(item => item.trim()).filter(item => item);
      let materialsSection = materialsList.map(item => `- ${item}`).join('\n');
      
      lessonPlan = lessonPlan.replace(
        procedurePattern, 
        `## Materials Needed\n${materialsSection}\n\n## Lesson Procedure`
      );
    }
  }
  
  // 5. Add teacher notes if provided (these should come last)
  if (notes) {
    // Add a new Teacher Notes section at the end
    lessonPlan += `\n\n## Teacher Notes\n${notes}\n`;
  }
  
  // Add a note at the top about this being a demo
  lessonPlan = `> Note: This is a sample lesson plan template customized with your input. For fully personalized lesson plans, a valid AI API key would be required.\n\n${lessonPlan}`;
  
  return lessonPlan;
}

// Function to generate a lesson plan using Claude API
async function generateLessonPlanWithClaude(subject, audience, topic, time, standards, objectives, options, materials, notes) {
  // Add timeout handling for Claude API
  const TIMEOUT_MS = 25000; // 25 second timeout
  
  try {
    console.log("Starting Claude API integration");
    // Get API key from environment
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey || !isValidClaudeApiKey(apiKey)) {
      console.error("Claude API key not found or invalid");
      throw new Error('Claude API key not found or invalid. Please add a valid ANTHROPIC_API_KEY to the .env.local file.');
    }
    
    console.log("Claude API key found, initializing client");
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });
    
    // Create an AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    
    // Construct a prompt for Claude
    let prompt = `
    Please create a detailed lesson plan for ${audience} students about ${topic} in ${subject}.
    
    The lesson plan should follow this structure:
    1. A title and overview
    2. Clear learning objectives
    3. Standards addressed
    4. Materials needed
    5. Vocabulary terms
    6. Detailed lesson procedure with timing
    7. Assessment methods
    8. Differentiation strategies
    9. Extensions or homework
    10. References/resources
    
    Additional requirements:
    `;
    
    // Add any custom objectives
    if (objectives) {
      prompt += `\n- Learning objectives should include: ${objectives}`;
    }
    
    // Add specific focus areas
    if (options && options.length > 0) {
      prompt += `\n- Focus specifically on: ${options}`;
    }
    
    // Add material constraints
    if (materials) {
      prompt += `\n- IMPORTANT: Use ONLY these materials and nothing else: ${materials}. Do not add any additional materials to the list.`;
    } else {
      prompt += `\n- Keep the materials list simple and practical. Do not suggest overly complex or hard-to-source materials.`;
    }
    
    // Add time constraints
    if (time) {
      prompt += `\n- The lesson should be designed for a ${time} time period`;
    }
    
    // Add standards
    if (standards) {
      prompt += `\n- Address these standards: ${standards}`;
    }
    
    // Add teacher notes
    if (notes) {
      prompt += `\n- Additional requirements: ${notes}`;
    }
    
    prompt += `\n\nPlease format the lesson plan in Markdown with clear headings and bullet points.`;
    
    console.log("Prompt prepared for Claude, sending request...");
    
    // Call Claude API with timeout handling
    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }, 
      {
        signal: controller.signal,
      }).catch(error => {
        if (error.name === 'AbortError') {
          console.error('Claude API request timed out');
          // Fall back to demo lesson plan
          return { 
            content: [{ 
              type: 'text', 
              text: generateDemoLessonPlan(subject, audience, topic, time, standards, objectives, options, materials, notes) 
            }] 
          };
        }
        throw error;
      });
      
      clearTimeout(timeoutId);
      
      console.log("Claude API response received");
      
      // Extract the lesson plan text from Claude's response - fix the type issue
      let lessonPlan = '';
      
      // Check if there's any content and it has the expected structure
      if (response.content && response.content.length > 0) {
        console.log("Content found in response, type:", response.content[0].type);
        
        const contentBlock = response.content[0];
        
        // Type guard to check if it's a text content block
        if (contentBlock.type === 'text') {
          lessonPlan = contentBlock.text;
          console.log("Successfully extracted text content, length:", lessonPlan.length);
        } else {
          // Fallback in case the structure is unexpected
          console.error("Unexpected content type:", contentBlock.type);
          lessonPlan = "Error: Unable to parse Claude's response. Please try again.";
        }
      } else {
        console.error("No content in Claude response");
        lessonPlan = "Error: No content received from Claude API. Please try again.";
      }
      
      return lessonPlan;
    } catch (apiError) {
      console.error("Error during Claude API call:", apiError);
      // Fall back to demo lesson plan on API error
      return generateDemoLessonPlan(subject, audience, topic, time, standards, objectives, options, materials, notes);
    }
  } catch (error) {
    console.error('Error generating lesson plan with Claude:', error);
    // Fallback to demo lesson plan on any error
    return generateDemoLessonPlan(subject, audience, topic, time, standards, objectives, options, materials, notes);
  }
}

// Update the isValidClaudeApiKey function to be more robust
function isValidClaudeApiKey(key: string | undefined): boolean {
  if (!key) return false;
  // Claude API keys start with sk-ant prefix
  return key.startsWith('sk-ant') && key.length > 30;
}

export async function POST(request: NextRequest) {
  try {
    console.log("Received lesson plan generation request");
    
    // Parse the request body
    const requestData = await request.json();
    const { subject, audience, topic, time, standards, objectives, options, materials, notes } = requestData;
    
    // Check if Claude API is enabled
    const useClaudeApi = process.env.USE_CLAUDE_API === 'true';
    console.log("Claude API enabled in environment:", useClaudeApi);
    
    // Check if demo mode is forced by the header
    const forceDemoMode = request.headers.get('X-Force-Demo-Mode') === 'true';
    console.log("Force demo mode header present:", forceDemoMode);
    
    if (forceDemoMode) {
      console.log("Demo mode forced by request header - returning demo plan");
      // Return a demo lesson plan immediately without authentication
      return NextResponse.json({
        lessonPlan: generateDemoLessonPlan(subject, audience, topic, time, standards, objectives, options, materials, notes),
        fromDemo: true,
        error: null,
        metadata: {
          mode: 'demo',
          forceDemo: true,
          reason: 'Forced by request header'
        }
      });
    }
    
    if (!useClaudeApi) {
      console.log("Claude API is disabled in environment, using demo lesson plans");
      // Return a demo lesson plan to avoid using up Claude API credits
      return NextResponse.json({
        lessonPlan: generateDemoLessonPlan(subject, audience, topic, time, standards, objectives, options, materials, notes),
        fromDemo: true,
        error: null,
        metadata: {
          mode: 'demo',
          reason: 'Claude API disabled in environment'
        }
      });
    }
    
    // Validate Claude API key before proceeding
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const isValidKey = isValidClaudeApiKey(apiKey);
    console.log("API Key check:", apiKey ? "Present" : "Missing", "| Valid format:", isValidKey);
    
    if (!apiKey || !isValidKey) {
      console.error("Invalid or missing Claude API key");
      return NextResponse.json({
        lessonPlan: generateDemoLessonPlan(subject, audience, topic, time, standards, objectives, options, materials, notes),
        fromDemo: true,
        error: "Invalid API key - using demo lesson plan",
        metadata: {
          mode: 'demo',
          reason: 'Invalid or missing API key'
        }
      });
    }
    
    // Authentication is only needed for paid API usage scenarios
    // Since we have a valid API key and Claude is enabled, we'll proceed with the API call regardless of authentication
    // This change allows the real API to be used without requiring login on the client side
    
    try {
      console.log("Starting Claude API generation...");
      // Generate lesson plan with Claude API
      const lessonPlan = await generateLessonPlanWithClaude(
        subject, audience, topic, time, standards, objectives, options, materials, notes
      );
      console.log("Claude generation complete, lesson plan length:", lessonPlan.length);
      
      return NextResponse.json({
        lessonPlan,
        fromDemo: false,
        error: null,
        metadata: {
          standards,
          audience,
          time,
          subject,
          topic,
          objectives,
          options,
          materials,
          notes,
          generatedAt: new Date().toISOString(),
          mode: 'claude',
          authRequired: false
        }
      });
    } catch (error: any) {
      console.error("Error in Claude API generation:", error);
      // Fall back to demo mode on Claude API error
      return NextResponse.json({
        lessonPlan: generateDemoLessonPlan(subject, audience, topic, time, standards, objectives, options, materials, notes),
        fromDemo: true,
        error: `Claude API error: ${error.message || 'Unknown error'}`,
        metadata: {
          mode: 'demo',
          reason: 'Claude API error',
          error: error.message || 'Unknown error'
        }
      });
    }
  } catch (error: any) {
    console.error("General error in lesson plan generation:", error);
    return NextResponse.json(
      { 
        error: `Error generating lesson plan: ${error.message || 'Unknown error'}`,
        lessonPlan: null,
        fromDemo: false
      }, 
      { status: 500 }
    );
  }
} 