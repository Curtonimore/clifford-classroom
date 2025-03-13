'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

// Define the LessonPlanMetadata interface
interface LessonPlanMetadata {
  standards: string;
  audience: string;
  time: string;
  subject: string;
  topic: string;
  objectives: string;
  generatedAt: string;
  [key: string]: any; // Allow other properties
}

// Subject-Topic relationship data structure
const SUBJECTS_CONFIG = {
  mathematics: {
    label: "Mathematics",
    topics: [
      { value: "numbers", label: "Numbers and Operations" },
      { value: "fractions", label: "Fractions and Decimals" },
      { value: "geometry", label: "Geometry and Measurement" },
      { value: "algebra", label: "Algebra and Patterns" },
      { value: "statistics", label: "Data and Statistics" },
    ],
    options: {
      "numbers": [
        { id: "addition", label: "Addition" },
        { id: "subtraction", label: "Subtraction" },
        { id: "multiplication", label: "Multiplication" },
        { id: "division", label: "Division" },
        { id: "place_value", label: "Place Value" },
      ],
      "fractions": [
        { id: "equivalent", label: "Equivalent Fractions" },
        { id: "comparing", label: "Comparing Fractions" },
        { id: "add_sub", label: "Adding/Subtracting Fractions" },
        { id: "multiply", label: "Multiplying Fractions" },
        { id: "decimal", label: "Decimal Conversion" },
      ],
      "geometry": [
        { id: "shapes", label: "2D Shapes" },
        { id: "solids", label: "3D Solids" },
        { id: "area", label: "Area and Perimeter" },
        { id: "angles", label: "Angles" },
        { id: "symmetry", label: "Symmetry" },
      ],
      "algebra": [
        { id: "equations", label: "Simple Equations" },
        { id: "patterns", label: "Number Patterns" },
        { id: "variables", label: "Variables" },
        { id: "functions", label: "Functions" },
      ],
      "statistics": [
        { id: "graphs", label: "Graphs and Charts" },
        { id: "mean_median", label: "Mean, Median, Mode" },
        { id: "probability", label: "Probability" },
        { id: "data_collection", label: "Data Collection" },
      ]
    }
  },
  science: {
    label: "Science",
    topics: [
      { value: "life_science", label: "Life Science" },
      { value: "earth_science", label: "Earth Science" },
      { value: "physical_science", label: "Physical Science" },
      { value: "environmental", label: "Environmental Science" },
      { value: "engineering", label: "Engineering and Technology" },
    ],
    options: {
      "life_science": [
        { id: "ecosystems", label: "Ecosystems" },
        { id: "plants", label: "Plants" },
        { id: "animals", label: "Animals" },
        { id: "human_body", label: "Human Body" },
        { id: "cells", label: "Cells" },
      ],
      "earth_science": [
        { id: "weather", label: "Weather and Climate" },
        { id: "geology", label: "Rocks and Minerals" },
        { id: "space", label: "Space and Astronomy" },
        { id: "water_cycle", label: "Water Cycle" },
      ],
      "physical_science": [
        { id: "matter", label: "Properties of Matter" },
        { id: "forces", label: "Forces and Motion" },
        { id: "energy", label: "Energy" },
        { id: "sound", label: "Sound and Light" },
        { id: "magnetism", label: "Magnetism and Electricity" },
      ],
      "environmental": [
        { id: "conservation", label: "Conservation" },
        { id: "pollution", label: "Pollution" },
        { id: "natural_resources", label: "Natural Resources" },
        { id: "biomes", label: "Biomes" },
      ],
      "engineering": [
        { id: "design", label: "Design Process" },
        { id: "structures", label: "Building Structures" },
        { id: "simple_machines", label: "Simple Machines" },
        { id: "coding", label: "Basic Coding" },
      ]
    }
  },
  language_arts: {
    label: "Language Arts",
    topics: [
      { value: "reading", label: "Reading" },
      { value: "writing", label: "Writing" },
      { value: "grammar", label: "Grammar" },
      { value: "vocabulary", label: "Vocabulary" },
      { value: "speaking", label: "Speaking and Listening" },
    ],
    options: {
      "reading": [
        { id: "comprehension", label: "Reading Comprehension" },
        { id: "fluency", label: "Reading Fluency" },
        { id: "literature", label: "Literature Analysis" },
        { id: "nonfiction", label: "Nonfiction Text" },
        { id: "phonics", label: "Phonics" },
      ],
      "writing": [
        { id: "narrative", label: "Narrative Writing" },
        { id: "informative", label: "Informative Writing" },
        { id: "persuasive", label: "Persuasive Writing" },
        { id: "research", label: "Research Writing" },
        { id: "creative", label: "Creative Writing" },
      ],
      "grammar": [
        { id: "parts_speech", label: "Parts of Speech" },
        { id: "sentences", label: "Sentence Structure" },
        { id: "punctuation", label: "Punctuation" },
        { id: "verb_tense", label: "Verb Tenses" },
      ],
      "vocabulary": [
        { id: "word_meaning", label: "Word Meaning" },
        { id: "context_clues", label: "Context Clues" },
        { id: "root_words", label: "Root Words/Affixes" },
        { id: "academic_vocab", label: "Academic Vocabulary" },
      ],
      "speaking": [
        { id: "presentations", label: "Presentations" },
        { id: "discussions", label: "Discussions" },
        { id: "listening", label: "Active Listening" },
        { id: "debate", label: "Debate" },
      ]
    }
  },
  social_studies: {
    label: "Social Studies",
    topics: [
      { value: "history", label: "History" },
      { value: "geography", label: "Geography" },
      { value: "civics", label: "Civics and Government" },
      { value: "economics", label: "Economics" },
      { value: "cultures", label: "Cultures" },
    ],
    options: {
      "history": [
        { id: "us_history", label: "U.S. History" },
        { id: "world_history", label: "World History" },
        { id: "local_history", label: "Local History" },
        { id: "historical_figures", label: "Historical Figures" },
      ],
      "geography": [
        { id: "maps", label: "Maps and Globes" },
        { id: "landforms", label: "Landforms" },
        { id: "regions", label: "Regions" },
        { id: "human_geo", label: "Human Geography" },
      ],
      "civics": [
        { id: "government", label: "Government Structure" },
        { id: "citizenship", label: "Citizenship" },
        { id: "rights", label: "Rights and Responsibilities" },
        { id: "community", label: "Community Helpers" },
      ],
      "economics": [
        { id: "goods_services", label: "Goods and Services" },
        { id: "money", label: "Money and Trade" },
        { id: "resources", label: "Economic Resources" },
        { id: "decision", label: "Economic Decision Making" },
      ],
      "cultures": [
        { id: "traditions", label: "Traditions" },
        { id: "diversity", label: "Cultural Diversity" },
        { id: "holidays", label: "Holidays and Celebrations" },
        { id: "communities", label: "Communities" },
      ]
    }
  }
};

// Grade level options
const GRADE_LEVELS = [
  { value: "k", label: "Kindergarten" },
  { value: "1", label: "1st Grade" },
  { value: "2", label: "2nd Grade" },
  { value: "3", label: "3rd Grade" },
  { value: "4", label: "4th Grade" },
  { value: "5", label: "5th Grade" },
  { value: "6", label: "6th Grade" },
  { value: "7", label: "7th Grade" },
  { value: "8", label: "8th Grade" },
  { value: "9", label: "9th Grade" },
  { value: "10", label: "10th Grade" },
  { value: "11", label: "11th Grade" },
  { value: "12", label: "12th Grade" },
];

// Duration options
const DURATION_OPTIONS = [
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "60 minutes" },
  { value: "90", label: "90 minutes" },
  { value: "day", label: "Full day" },
  { value: "week", label: "Week-long unit" },
];

export default function LessonPlanPage() {
  const { setCurrentPath, showNotification, userSubscription, getAICreditsRemaining, hasFeature } = useAppContext();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    standards: '',
    audience: '',
    time: '',
    subject: 'mathematics',
    topic: '',
    objectives: '',
    selectedOptions: [] as string[],
    materials: '',
    notes: ''
  });
  
  // UI state
  const [availableTopics, setAvailableTopics] = useState<{value: string, label: string}[]>([]);
  const [topicOptions, setTopicOptions] = useState<{id: string, label: string}[]>([]);
  
  // Demo mode state - forced for unauthenticated users, optional for authenticated
  const [demoMode, setDemoMode] = useState(true);
  
  // AI credits
  const [aiCredits, setAiCredits] = useState(0);
  
  // State for lesson plan generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [lessonPlan, setLessonPlan] = useState('');
  const [lessonPlanMetadata, setLessonPlanMetadata] = useState<LessonPlanMetadata | null>(null);
  
  // State for saving lesson plan
  const [isSaving, setIsSaving] = useState(false);
  
  // State for storage usage
  const [storageUsage, setStorageUsage] = useState<{
    used: number;
    limit: number;
    percentUsed: number;
    remaining: number;
  } | null>(null);
  
  // Check authentication status
  useEffect(() => {
    if (authStatus !== 'loading') {
      const authenticated = authStatus === 'authenticated';
      setIsAuthenticated(authenticated);
      setAuthChecked(true);
      
      // Force demo mode for unauthenticated users
      if (!authenticated) {
        setDemoMode(true);
      } else {
        // For authenticated users, default to demo mode but allow them to change it
        // Check if user has access to AI lesson plans
        const hasAiAccess = hasFeature('unlimited_lesson_plans');
        if (!hasAiAccess) {
          // Just set default to true, but don't force it
          setDemoMode(true);
        }
        
        // Get AI credits
        setAiCredits(getAICreditsRemaining());
        
        // Fetch storage usage
        fetchStorageUsage();
      }
    }
  }, [authStatus, hasFeature, getAICreditsRemaining]);
  
  // Fetch storage usage information
  const fetchStorageUsage = async () => {
    try {
      const response = await fetch('/api/lesson-plans/storage-usage');
      if (response.ok) {
        const data = await response.json();
        setStorageUsage(data.storageInfo);
      }
    } catch (error) {
      console.error('Error fetching storage usage:', error);
    }
  };
  
  // Set the current section
  useEffect(() => {
    setCurrentPath('ai-teaching-tools', 'lesson-plan');
  }, [setCurrentPath]);
  
  // Update available topics when subject changes
  useEffect(() => {
    if (formData.subject && SUBJECTS_CONFIG[formData.subject]) {
      setAvailableTopics(SUBJECTS_CONFIG[formData.subject].topics);
      // Reset topic when subject changes
      setFormData(prev => ({
        ...prev,
        topic: '',
        selectedOptions: []
      }));
      setTopicOptions([]);
    } else {
      setAvailableTopics([]);
    }
  }, [formData.subject]);
  
  // Update available options when topic changes
  useEffect(() => {
    if (formData.subject && formData.topic && 
        SUBJECTS_CONFIG[formData.subject]?.options?.[formData.topic]) {
      setTopicOptions(SUBJECTS_CONFIG[formData.subject].options[formData.topic]);
    } else {
      setTopicOptions([]);
    }
  }, [formData.subject, formData.topic]);

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (optionId) => {
    setFormData(prev => {
      const updatedOptions = prev.selectedOptions.includes(optionId)
        ? prev.selectedOptions.filter(id => id !== optionId)
        : [...prev.selectedOptions, optionId];
        
      return {
        ...prev,
        selectedOptions: updatedOptions
      };
    });
  };
  
  // Handle demo mode toggle
  const handleDemoModeToggle = () => {
    // Allow any authenticated user to toggle demo mode
    if (isAuthenticated) {
      setDemoMode(!demoMode);
      
      // Show a notification about premium features if user doesn't have unlimited access
      if (!demoMode && !hasFeature('unlimited_lesson_plans')) {
        showNotification('You are using demo mode with limited features. Upgrade for full AI capabilities!');
      }
    }
  };
  
  // Redirect to login if not authenticated
  const handleLoginRedirect = () => {
    router.push('/api/auth/signin?callbackUrl=/lesson-plan');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Log that we're starting the form submission
    console.log("Form submission started");
    
    // Get the selected subject and topic labels for better readability
    const subjectLabel = formData.subject ? SUBJECTS_CONFIG[formData.subject].label : '';
    
    const topicObj = formData.subject && formData.topic && SUBJECTS_CONFIG[formData.subject]?.topics
      ? SUBJECTS_CONFIG[formData.subject].topics.find(t => t.value === formData.topic)
      : null;
    const topicLabel = topicObj?.label || '';
    
    // Get selected option labels
    const selectedOptionLabels = formData.selectedOptions.map(optId => {
      const option = topicOptions.find(opt => opt.id === optId);
      return option?.label || '';
    }).join(", ");
    
    // Get audience from grade level
    const audienceObj = GRADE_LEVELS.find(g => g.value === formData.audience);
    const audienceLabel = audienceObj?.label || formData.audience;
    
    // Get time from duration
    const timeObj = DURATION_OPTIONS.find(d => d.value === formData.time);
    const timeLabel = timeObj?.label || formData.time;
    
    // Log the form data being sent to the API
    console.log("Form data to be sent:", {
      subject: subjectLabel,
      topic: topicLabel,
      audience: audienceLabel,
      time: timeLabel,
      options: selectedOptionLabels,
      objectives: formData.objectives,
      standards: formData.standards,
      materials: formData.materials,
      notes: formData.notes,
      demoMode: demoMode
    });
    
    // Validate form
    if (!formData.subject || !formData.topic || !formData.audience) {
      showNotification('Please select Grade Level, Subject, and Topic');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      console.log("Sending API request...");
      const response = await fetch('/api/generate-lesson-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add demo mode header
          ...(demoMode && { 'X-Force-Demo-Mode': 'true' })
        },
        body: JSON.stringify({
          standards: formData.standards,
          audience: audienceLabel,
          time: timeLabel,
          subject: subjectLabel,
          topic: topicLabel,
          objectives: formData.objectives,
          options: selectedOptionLabels,
          materials: formData.materials,
          notes: formData.notes
        })
      });
      
      console.log("API response received, status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error response:", errorData);
        throw new Error(errorData.error || 'Failed to generate lesson plan');
      }
      
      const data = await response.json();
      console.log("Lesson plan data received, length:", data.lessonPlan?.length || 0);
      
      setLessonPlan(data.lessonPlan);
      setLessonPlanMetadata(data.metadata);
      showNotification(demoMode 
        ? 'Demo lesson plan generated successfully!' 
        : 'Lesson plan generated successfully!');
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } catch (error: any) {
      console.error('Error generating lesson plan:', error);
      
      // Provide more detailed error message to user
      let errorMessage = 'Failed to generate lesson plan. Please try again.';
      
      if (error.message && error.message.includes('API Key Error')) {
        errorMessage = 'API configuration error. Using demo mode instead.';
        // Try to generate a demo lesson plan automatically
        setIsGenerating(true);
        try {
          const demoResponse = await fetch('/api/generate-lesson-plan', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Force-Demo-Mode': 'true', // Signal to use demo mode
            },
            body: JSON.stringify({
              standards: formData.standards,
              audience: audienceLabel,
              time: timeLabel,
              subject: subjectLabel,
              topic: topicLabel,
              objectives: formData.objectives,
              options: selectedOptionLabels,
              materials: formData.materials,
              notes: formData.notes
            })
          });
          
          if (demoResponse.ok) {
            const demoData = await demoResponse.json();
            setLessonPlan(demoData.lessonPlan);
            setLessonPlanMetadata(demoData.metadata);
            showNotification('Using demo mode: Lesson plan generated successfully!');
            
            // Scroll to results
            setTimeout(() => {
              document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 500);
            return;
          }
        } catch (demoError) {
          console.error('Error in demo fallback:', demoError);
        }
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      showNotification(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  // Replace PDF download with print functionality
  const handlePrint = () => {
    if (!lessonPlan || !lessonPlanMetadata) {
      showNotification('No lesson plan to print. Please generate one first.');
      return;
    }
    
    // Add a class to body before printing
    document.body.classList.add('printing');
    
    // Trigger print
    window.print();
    
    // Remove class after print dialog is closed
    setTimeout(() => {
      document.body.classList.remove('printing');
    }, 500);
    
    showNotification('Print dialog opened. Please use your browser to print or save as PDF.');
  };

  // Add a special effect for print media
  useEffect(() => {
    // Add print styles to document
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        /* Hide everything except the lesson plan */
        body * {
          visibility: hidden;
        }
        
        /* Show only the lesson plan container and its children */
        .lesson-plan-container, 
        .lesson-plan-container * {
          visibility: visible;
        }
        
        /* Position the lesson plan at the top of the page */
        .lesson-plan-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding: 15mm !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          background-color: white !important;
        }
        
        /* Additional print styling */
        .lesson-plan-container h1 {
          font-size: 16pt !important;
          margin-top: 0 !important;
          margin-bottom: 8pt !important;
        }
        
        .lesson-plan-container h2 {
          font-size: 14pt !important;
          margin-top: 10pt !important;
          margin-bottom: 6pt !important;
          page-break-after: avoid !important;
        }
        
        .lesson-plan-container h3 {
          font-size: 12pt !important;
          margin-top: 8pt !important;
          margin-bottom: 4pt !important;
          page-break-after: avoid !important;
        }
        
        .lesson-plan-container p, 
        .lesson-plan-container li {
          font-size: 11pt !important;
          line-height: 1.3 !important;
          margin-top: 2pt !important;
          margin-bottom: 2pt !important;
        }
        
        /* Remove the 'page-break-before: always' rule for h2 elements */
        /* Only add page breaks before major sections like 'Lesson Plan' or 'Assessment' */
        .lesson-plan-container h2:not(:first-of-type) {
          page-break-before: auto;
        }
        
        /* Only force page breaks for these specific sections */
        .lesson-plan-container h2:matches(:contains('Lesson Procedure'), :contains('Assessment')) {
          page-break-before: always;
        }
        
        /* Ensure header/footer elements stay with their content */
        .lesson-plan-metadata {
          page-break-after: avoid !important;
        }
        
        .lesson-plan-container table {
          margin-bottom: 8pt !important;
        }
        
        .lesson-plan-container td {
          padding: 2pt 0 !important;
        }
        
        /* Reduce spacing for lists */
        .lesson-plan-container ul,
        .lesson-plan-container ol {
          margin-top: 2pt !important;
          margin-bottom: 2pt !important;
          padding-left: 15pt !important;
        }
        
        /* Control orphans and widows */
        .lesson-plan-container p, 
        .lesson-plan-container li,
        .lesson-plan-container h2,
        .lesson-plan-container h3 {
          orphans: 3 !important;
          widows: 3 !important;
        }
        
        /* Footer with page numbers */
        @page {
          margin: 15mm;
          @bottom-center {
            content: "Page " counter(page) " of " counter(pages);
            font-family: serif;
            font-style: italic;
            font-size: 9pt;
          }
        }
      }
      
      /* Special class added to body during printing */
      body.printing .lesson-plan-container {
        background-color: white !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        z-index: 9999 !important;
      }
    `;
    document.head.appendChild(style);
    
    // Clean up style when component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Handle saving lesson plan
  const handleSaveLessonPlan = async () => {
    if (!lessonPlan || !lessonPlanMetadata) {
      showNotification('No lesson plan to save. Please generate one first.');
      return;
    }
    
    setIsSaving(true);
    
    try {
      console.log("Sending API request to save lesson plan...");
      const response = await fetch('/api/lesson-plans/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${lessonPlanMetadata?.subject}: ${lessonPlanMetadata?.topic}`,
          subject: lessonPlanMetadata?.subject || '',
          audience: lessonPlanMetadata?.audience || '',
          time: lessonPlanMetadata?.time || '',
          topic: lessonPlanMetadata?.topic || '',
          objectives: lessonPlanMetadata?.objectives || '',
          content: lessonPlan,
          isPublic: false,
          tags: [lessonPlanMetadata?.subject || '', lessonPlanMetadata?.topic || '']
        })
      });
      
      console.log("API response received, status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error response:", errorData);
        
        // Handle storage limit errors specifically
        if (response.status === 403 && errorData.storageInfo) {
          setStorageUsage(errorData.storageInfo);
          throw new Error(`${errorData.error} Upgrade your subscription to increase this limit.`);
        }
        
        throw new Error(errorData.error || 'Failed to save lesson plan');
      }
      
      const responseData = await response.json();
      
      // Update storage usage if available in response
      if (responseData.storageInfo) {
        setStorageUsage(responseData.storageInfo);
      }
      
      showNotification('Lesson plan saved successfully!');
    } catch (error: any) {
      console.error('Error saving lesson plan:', error);
      
      // Provide more detailed error message to user
      let errorMessage = 'Failed to save lesson plan. Please try again.';
      
      if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      showNotification(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Lesson Plan Generator</h1>
        <p className="page-description">
          Create customized lesson plans in seconds with our AI-powered tool
        </p>
        <div className="back-link" style={{ marginTop: '0.5rem' }}>
          <Link href="/ai-teaching-tools" style={{ color: '#0070f3', textDecoration: 'none' }}>
            &larr; Back to AI Teaching Tools
          </Link>
        </div>
      </header>
      
      <section className="content-section">
        <h2>Generate Your Lesson Plan</h2>
        <p>
          Our AI-powered tool helps you create comprehensive lesson plans tailored to your specific needs.
          Simply select your criteria below and our AI will generate a customized plan for you.
        </p>
        
        {authChecked && !isAuthenticated && (
          <div className="auth-notice">
            <div className="auth-message">
              <h3>Demo Mode</h3>
              <p>
                You are currently using the demo version of our Lesson Plan Generator. This version provides 
                basic functionality with pre-built templates.
              </p>
              <p>
                <strong>Sign in to access advanced features:</strong>
              </p>
              <ul>
                <li>Advanced AI-powered lesson plan generation</li>
                <li>Save your lesson plans to your account</li>
                <li>Customize plans with more options</li>
              </ul>
              <button 
                onClick={handleLoginRedirect}
                className="login-button"
                style={{ marginTop: '1rem' }}
              >
                Sign In to Unlock Full Features
              </button>
            </div>
          </div>
        )}
        
        {isAuthenticated && (
          <div className="premium-notice">
            <div className="premium-message">
              <h3>Coming Soon: Premium Plans</h3>
              <p>
                We're excited to announce that premium subscription plans are coming soon!
              </p>
              <p>
                <strong>Premium subscribers will enjoy:</strong>
              </p>
              <ul>
                <li>Unlimited AI-generated lesson plans</li>
                <li>Advanced customization options</li>
                <li>Save and organize your lesson plans in your personal library</li>
                <li>Export to various formats (PDF, Word, Google Docs)</li>
                <li>Collaborative features for team planning</li>
              </ul>
              <p>
                All registered users will receive an email when premium plans are available.
                For now, enjoy the demo mode for free!
              </p>
              
              {isAuthenticated && userSubscription && (
                <div className="subscription-status">
                  <p><strong>Your current plan:</strong> {userSubscription.tier.charAt(0).toUpperCase() + userSubscription.tier.slice(1)}</p>
                  <p><strong>AI credits remaining:</strong> {aiCredits === Infinity ? 'Unlimited' : aiCredits}</p>
                  
                  {/* Add storage usage information */}
                  {storageUsage && (
                    <div className="storage-usage">
                      <p>
                        <strong>Lesson Plan Storage:</strong> {storageUsage.used} of {storageUsage.limit === Infinity ? '∞' : storageUsage.limit}
                        {storageUsage.limit !== Infinity && (
                          <span className="storage-percentage"> ({storageUsage.percentUsed}% used)</span>
                        )}
                      </p>
                      {storageUsage.limit !== Infinity && (
                        <div className="storage-bar">
                          <div 
                            className="storage-bar-fill" 
                            style={{ 
                              width: `${Math.min(storageUsage.percentUsed, 100)}%`,
                              backgroundColor: storageUsage.percentUsed > 90 
                                ? '#ef4444' // red for >90%
                                : storageUsage.percentUsed > 70 
                                  ? '#f59e0b' // orange for >70%
                                  : '#10b981' // green for <70%
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <Link href="/subscription" className="login-button" style={{ display: 'inline-block', marginTop: '0.5rem' }}>
                    View Subscription Plans
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
        
        <form 
          onSubmit={handleSubmit}
          className="form-container" 
          style={{ maxWidth: '700px', margin: '2rem auto' }}
        >
          {isAuthenticated && (
            <div className="demo-toggle">
              <label className="demo-toggle-label">
                <input
                  type="checkbox"
                  checked={demoMode}
                  onChange={handleDemoModeToggle}
                  className="demo-checkbox"
                />
                <span className="demo-toggle-info">
                  Demo Mode {demoMode ? 'Enabled' : 'Disabled'} 
                  <small style={{ display: 'block', marginTop: '4px' }}>
                    {demoMode 
                      ? 'Using pre-built templates (no AI credits used)' 
                      : 'Using AI generation (consumes AI credits)'}
                  </small>
                </span>
              </label>
            </div>
          )}
          
          {!demoMode && !hasFeature('unlimited_lesson_plans') && (
            <div className="warning-message" style={{ marginBottom: '1rem' }}>
              <strong>Note:</strong> You are using AI generation with limited credits. 
              <Link href="/subscription" style={{ marginLeft: '0.5rem', color: '#0070f3' }}>
                Upgrade to premium
              </Link> for unlimited access.
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="audience" className="form-label">Grade Level<span style={{ color: 'red' }}>*</span></label>
            <select 
              id="audience" 
              className="form-input"
              value={formData.audience}
              onChange={handleChange}
              required
            >
              <option value="">Select Grade Level</option>
              {GRADE_LEVELS.map(grade => (
                <option key={grade.value} value={grade.value}>{grade.label}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="subject" className="form-label">Subject Area<span style={{ color: 'red' }}>*</span></label>
            <select 
              id="subject" 
              className="form-input"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="">Select Subject</option>
              {Object.entries(SUBJECTS_CONFIG).map(([value, { label }]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="topic" className="form-label">Topic<span style={{ color: 'red' }}>*</span></label>
            <select 
              id="topic" 
              className="form-input"
              value={formData.topic}
              onChange={handleChange}
              required
              disabled={!formData.subject}
            >
              <option value="">Select Topic</option>
              {availableTopics.map(topic => (
                <option key={topic.value} value={topic.value}>{topic.label}</option>
              ))}
            </select>
          </div>
          
          {topicOptions.length > 0 && (
            <div className="form-group">
              <label className="form-label">Specific Focus Areas</label>
              <div 
                className="checkbox-grid"
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '0.5rem'
                }}
              >
                {topicOptions.map(option => (
                  <div key={option.id} style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      id={`option-${option.id}`}
                      checked={formData.selectedOptions.includes(option.id)}
                      onChange={() => handleCheckboxChange(option.id)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    <label htmlFor={`option-${option.id}`}>{option.label}</label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="time" className="form-label">Lesson Duration</label>
            <select 
              id="time" 
              className="form-input"
              value={formData.time}
              onChange={handleChange}
            >
              <option value="">Select Duration</option>
              {DURATION_OPTIONS.map(duration => (
                <option key={duration.value} value={duration.value}>{duration.label}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="standards" className="form-label">Standards</label>
            <input 
              type="text" 
              id="standards" 
              className="form-input" 
              placeholder="e.g., CCSS.ELA-LITERACY.RL.5.1" 
              value={formData.standards}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="objectives" className="form-label">Learning Objectives</label>
            <textarea 
              id="objectives" 
              className="form-input" 
              placeholder="e.g., Students will be able to identify and compare fractions..." 
              value={formData.objectives}
              onChange={handleChange}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="materials" className="form-label">Materials Available</label>
            <textarea 
              id="materials" 
              className="form-input" 
              placeholder="List materials you have available (e.g., paper, markers, iPads, manipulatives)..." 
              value={formData.materials}
              onChange={handleChange}
              rows={2}
              style={{ resize: 'vertical' }}
            />
            <p style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: '#666' }}>
              This helps ensure your lesson plan only includes activities using available resources.
            </p>
          </div>
          
          <div className="form-group">
            <label htmlFor="notes" className="form-label">Other Notes or Requirements</label>
            <textarea 
              id="notes" 
              className="form-input" 
              placeholder="Add any other specific requirements or notes for this lesson plan..." 
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              style={{ resize: 'vertical' }}
            />
            <p style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: '#666' }}>
              Examples: "Need to include group work", "Must have a homework component", "Should be inquiry-based"
            </p>
          </div>
          
          <button 
            type="submit"
            className="login-button"
            style={{ width: '100%' }}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : `Generate ${demoMode ? 'Demo ' : ''}Lesson Plan`}
          </button>
          
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'center' }}>
            <span style={{ color: 'red' }}>*</span> Required fields
          </p>
        </form>
      </section>
      
      {lessonPlan && (
        <section id="results-section" className="content-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Your Lesson Plan</h2>
            <div>
              {isAuthenticated && (
                <button
                  onClick={handleSaveLessonPlan}
                  className="home-button primary"
                  style={{ marginRight: '0.5rem' }}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save to My Account'}
                </button>
              )}
              <button 
                onClick={handlePrint}
                className="home-button primary"
              >
                Print / Save PDF
              </button>
            </div>
          </div>
          
          <div 
            className="lesson-plan-container"
            style={{ 
              backgroundColor: '#f9f9f9', 
              padding: '1.5rem', 
              borderRadius: '0.5rem',
              marginTop: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            {/* Add metadata section to the printable area */}
            <div className="lesson-plan-metadata" style={{ marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
              <h1 style={{ marginTop: 0 }}>{lessonPlanMetadata?.subject || 'Lesson Plan'}: {lessonPlanMetadata?.topic || ''}</h1>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '4px 0', width: '150px', fontWeight: 'bold' }}>Grade Level:</td>
                    <td style={{ padding: '4px 0' }}>{lessonPlanMetadata?.audience || ''}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', fontWeight: 'bold' }}>Duration:</td>
                    <td style={{ padding: '4px 0' }}>{lessonPlanMetadata?.time || ''}</td>
                  </tr>
                  {lessonPlanMetadata?.standards && (
                    <tr>
                      <td style={{ padding: '4px 0', fontWeight: 'bold' }}>Standards:</td>
                      <td style={{ padding: '4px 0' }}>{lessonPlanMetadata.standards}</td>
                    </tr>
                  )}
                  {lessonPlanMetadata?.objectives && (
                    <tr>
                      <td style={{ padding: '4px 0', fontWeight: 'bold', verticalAlign: 'top' }}>Objectives:</td>
                      <td style={{ padding: '4px 0' }}>{lessonPlanMetadata.objectives}</td>
                    </tr>
                  )}
                  <tr>
                    <td style={{ padding: '4px 0', fontWeight: 'bold' }}>Generated:</td>
                    <td style={{ padding: '4px 0' }}>{lessonPlanMetadata?.generatedAt ? new Date(lessonPlanMetadata.generatedAt).toLocaleString() : new Date().toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ textAlign: 'center', marginTop: '1rem', fontStyle: 'italic', fontSize: '0.9rem' }}>
                Generated by Clifford Classroom
              </div>
            </div>
            <ReactMarkdown>{lessonPlan}</ReactMarkdown>
          </div>
        </section>
      )}
      
      <section className="content-section">
        <h2>How It Works</h2>
        <ol style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
          <li>Select your grade level, subject, and topic</li>
          <li>Choose specific focus areas within your selected topic</li>
          <li>Add details about standards, objectives, and available materials</li>
          <li>Include any additional notes or requirements</li>
          <li>Click "Generate Lesson Plan"</li>
          <li>Review the generated lesson plan</li>
          <li>Click "Print / Save PDF" to print or save as PDF</li>
        </ol>
      </section>
      
      <style jsx>{`
        .auth-notice {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 1.5rem;
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          border-left: 4px solid #0070f3;
        }
        
        .auth-message {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .auth-message h3 {
          margin-top: 0;
          color: #0070f3;
        }
        
        .auth-message ul {
          margin-bottom: 1.5rem;
        }
        
        .auth-message li {
          margin-bottom: 0.5rem;
        }
        
        .premium-notice {
          background-color: #f0f8ff;
          border-radius: 8px;
          padding: 1.5rem;
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          border-left: 4px solid #8a2be2;
        }
        
        .premium-message {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .premium-message h3 {
          margin-top: 0;
          color: #8a2be2;
        }
        
        .premium-message ul {
          margin-bottom: 1.5rem;
        }
        
        .premium-message li {
          margin-bottom: 0.5rem;
        }
        
        .subscription-status {
          background-color: white;
          border-radius: 6px;
          padding: 1rem;
          margin-top: 1rem;
          border: 1px solid #e5e7eb;
        }
        
        .demo-toggle {
          display: flex;
          align-items: center;
          background-color: #f9f9f9;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
        }
        
        .demo-toggle-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 0.95rem;
        }
        
        .demo-checkbox {
          margin: 0;
        }
        
        .demo-toggle-info {
          margin-left: 0.5rem;
          font-size: 0.85rem;
          color: #666;
        }

        .demo-toggle {
          display: flex;
          align-items: center;
          background-color: #f5f7ff;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
          border: 1px solid #e5edff;
        }
        
        .demo-toggle-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 500;
          color: #333;
        }
        
        .demo-checkbox {
          margin: 0;
          width: 16px;
          height: 16px;
          accent-color: #0070f3;
        }
        
        .demo-toggle-info {
          margin-left: 0.5rem;
          font-size: 0.85rem;
          color: #666;
        }
        
        /* Consistent font sizes */
        h1, h2, h3, h4, h5, h6 {
          font-family: var(--font-sans);
          color: #111827;
        }
        
        h1 {
          font-size: 1.875rem;
          font-weight: 700;
        }
        
        h2 {
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        h3 {
          font-size: 1.25rem;
          font-weight: 600;
        }
        
        p, li, button, input, textarea, select {
          font-family: var(--font-sans);
        }
        
        .warning-message {
          background-color: #fff8e6;
          border: 1px solid #ffefc2;
          border-radius: 6px;
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          color: #92400e;
        }
        
        .storage-usage {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #e5edff;
        }
        
        .storage-percentage {
          font-size: 0.9rem;
          color: #6b7280;
          margin-left: 0.5rem;
        }
        
        .storage-bar {
          height: 8px;
          background-color: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 0.25rem;
        }
        
        .storage-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
      `}</style>
    </>
  );
} 