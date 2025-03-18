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
  const [isLoading, setIsLoading] = useState(false);
  const [lessonPlan, setLessonPlan] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('mathematics');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [availableOptions, setAvailableOptions] = useState<any[]>([]);
  const [availableTopics, setAvailableTopics] = useState<any[]>([]);
  
  // AI credits
  const [aiCredits, setAiCredits] = useState(0);
  
  // State for lesson plan generation
  const [isGenerating, setIsGenerating] = useState(false);
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
      
      // Force demo mode for unauthenticated users
      if (!authenticated) {
        setIsDemoMode(true);
      } else {
        // For authenticated users, default to demo mode but allow them to change it
        // Check if user has access to AI lesson plans
        const hasAiAccess = hasFeature('unlimited_lesson_plans');
        if (!hasAiAccess) {
          // Just set default to true, but don't force it
          setIsDemoMode(true);
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
    setCurrentPath('tools', 'lesson-plan');
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
      setAvailableOptions([]);
    } else {
      setAvailableTopics([]);
    }
  }, [formData.subject]);
  
  // Update available options when topic changes
  useEffect(() => {
    if (formData.subject && formData.topic && 
        SUBJECTS_CONFIG[formData.subject]?.options?.[formData.topic]) {
      setAvailableOptions(SUBJECTS_CONFIG[formData.subject].options[formData.topic]);
    } else {
      setAvailableOptions([]);
    }
  }, [formData.subject, formData.topic]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (optionId) => {
    setFormData((prev) => {
      const newSelectedOptions = prev.selectedOptions.includes(optionId)
        ? prev.selectedOptions.filter(id => id !== optionId)
        : [...prev.selectedOptions, optionId];
      
      return { ...prev, selectedOptions: newSelectedOptions };
    });
  };

  const handleDemoModeToggle = () => {
    setIsDemoMode(!isDemoMode);
    if (!isDemoMode) {
      showNotification('Demo mode enabled. The lesson plan will use pre-defined templates instead of AI generation.', 'info');
    } else {
      showNotification('Demo mode disabled. The lesson plan will be uniquely generated using AI.', 'info');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Create request payload - include demoMode flag
      const payload = {
        ...formData,
        demoMode: isDemoMode
      };
      
      // Send API request
      const response = await fetch('/api/generate-lesson-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate lesson plan');
      }
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        showNotification(data.error, 'error');
      }
      
      // Set the generated lesson plan
      setLessonPlan(data.lessonPlan);
      
      // Hide the form and show the result
      setIsFormVisible(false);
      
      // Show a notification about the source of the lesson plan
      if (data.fromDemo) {
        showNotification('Generated a demo lesson plan using templates', 'info');
      } else {
        showNotification('Successfully generated a custom AI lesson plan!', 'success');
      }
      
    } catch (error: any) {
      setError(error.message);
      showNotification(`Error: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">AI Lesson Plan Generator</h1>
      
      {/* Demo Mode Toggle */}
      <div className="bg-blue-50 p-4 mb-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="demoModeToggle"
            checked={isDemoMode}
            onChange={handleDemoModeToggle}
            className="mr-2"
          />
          <label htmlFor="demoModeToggle">
            Use Demo Mode (pre-defined templates)
          </label>
        </div>
        <p className="text-sm mt-2">
          {isDemoMode 
            ? "Demo mode is enabled. Your lesson plan will use pre-defined templates instead of AI generation."
            : "Demo mode is disabled. Your lesson plan will be uniquely generated using our AI system."}
        </p>
      </div>
      
      {isFormVisible ? (
        <form onSubmit={handleSubmit} className="bg-white p-4">
          <div className="mb-4">
            <label htmlFor="audience" className="block mb-1">Grade Level<span style={{ color: 'red' }}>*</span></label>
            <select 
              id="audience" 
              className="w-full p-2 border"
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
          
          <div className="mb-4">
            <label htmlFor="subject" className="block mb-1">Subject Area<span style={{ color: 'red' }}>*</span></label>
            <select 
              id="subject" 
              className="w-full p-2 border"
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
          
          <div className="mb-4">
            <label htmlFor="topic" className="block mb-1">Topic<span style={{ color: 'red' }}>*</span></label>
            <select 
              id="topic" 
              className="w-full p-2 border"
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
          
          {availableOptions.length > 0 && (
            <div className="mb-4">
              <label className="block mb-1">Specific Focus Areas</label>
              <div className="p-2 border">
                {availableOptions.map(option => (
                  <div key={option.id} className="mb-1">
                    <input
                      type="checkbox"
                      id={`option-${option.id}`}
                      checked={formData.selectedOptions.includes(option.id)}
                      onChange={() => handleCheckboxChange(option.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`option-${option.id}`}>{option.label}</label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="time" className="block mb-1">Lesson Duration</label>
            <select 
              id="time" 
              className="w-full p-2 border"
              value={formData.time}
              onChange={handleChange}
            >
              <option value="">Select Duration</option>
              {DURATION_OPTIONS.map(duration => (
                <option key={duration.value} value={duration.value}>{duration.label}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="standards" className="block mb-1">Standards</label>
            <input 
              type="text" 
              id="standards" 
              className="w-full p-2 border" 
              placeholder="e.g., CCSS.ELA-LITERACY.RL.5.1" 
              value={formData.standards}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="objectives" className="block mb-1">Learning Objectives</label>
            <textarea 
              id="objectives" 
              className="w-full p-2 border" 
              placeholder="e.g., Students will be able to identify and compare fractions..." 
              value={formData.objectives}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="materials" className="block mb-1">Materials Available</label>
            <textarea 
              id="materials" 
              className="w-full p-2 border" 
              placeholder="List materials you have available (e.g., paper, markers, iPads, manipulatives)..." 
              value={formData.materials}
              onChange={handleChange}
              rows={2}
            />
            <p className="text-xs mt-1 text-gray-500">
              This helps ensure your lesson plan only includes activities using available resources.
            </p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="notes" className="block mb-1">Other Notes or Requirements</label>
            <textarea 
              id="notes" 
              className="w-full p-2 border" 
              placeholder="Add any other specific requirements or notes for this lesson plan..." 
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
            <p className="text-xs mt-1 text-gray-500">
              Examples: "Need to include group work", "Must have a homework component", "Should be inquiry-based"
            </p>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4"
            >
              {isLoading ? 'Generating...' : isDemoMode ? 'Generate Demo Lesson Plan' : 'Generate AI Lesson Plan'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6">
          <div className="flex justify-between mb-4">
            <button
              onClick={() => setIsFormVisible(true)}
              className="bg-gray-500 text-white py-2 px-4"
            >
              Back to Form
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={handlePrint}
                className="bg-green-600 text-white py-2 px-4"
              >
                Print Lesson Plan
              </button>
              
              <button
                onClick={handleSaveLessonPlan}
                className="bg-blue-600 text-white py-2 px-4"
              >
                Save Lesson Plan
              </button>
            </div>
          </div>
          
          <div className="bg-white p-4 border lesson-plan-content">
            <ReactMarkdown>{lessonPlan}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
} 