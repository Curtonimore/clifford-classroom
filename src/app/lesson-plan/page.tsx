'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import ReactMarkdown from 'react-markdown';
import { generateLessonPlanPDF } from '@/utils/pdfGenerator';
import { useRouter } from 'next/navigation';
import { jsPDF } from 'jspdf';

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
  const { setCurrentPath, showNotification } = useAppContext();
  const router = useRouter();
  
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
  
  // State for lesson plan generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [lessonPlan, setLessonPlan] = useState('');
  const [lessonPlanMetadata, setLessonPlanMetadata] = useState(null);
  
  // Set the current section
  useEffect(() => {
    setCurrentPath('lesson-plan', '');
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
    
    // Validate form
    if (!formData.subject || !formData.topic || !formData.audience) {
      showNotification('Please select Grade Level, Subject, and Topic');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-lesson-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate lesson plan');
      }
      
      const data = await response.json();
      setLessonPlan(data.lessonPlan);
      setLessonPlanMetadata(data.metadata);
      showNotification('Lesson plan generated successfully!');
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } catch (error: any) {
      console.error('Error generating lesson plan:', error);
      showNotification(`Error: ${error.message || 'Failed to generate lesson plan. Please try again.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle PDF download
  const handleDownloadPDF = () => {
    if (!lessonPlan || !lessonPlanMetadata) {
      showNotification('No lesson plan to download. Please generate one first.');
      return;
    }
    
    try {
      const filename = generateLessonPlanPDF(lessonPlan, lessonPlanMetadata);
      showNotification(`Lesson plan downloaded as ${filename}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      showNotification('Error generating PDF. Please try again.');
    }
  };

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Lesson Plan Generator</h1>
        <p className="page-description">
          Create customized lesson plans in seconds with our AI-powered tool
        </p>
      </header>
      
      <section className="content-section">
        <h2>Generate Your Lesson Plan</h2>
        <p>
          Our AI-powered tool helps you create comprehensive lesson plans tailored to your specific needs.
          Simply select your criteria below and our AI will generate a customized plan for you.
        </p>
        
        <form 
          onSubmit={handleSubmit}
          className="form-container" 
          style={{ maxWidth: '700px', margin: '2rem auto' }}
        >
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
            {isGenerating ? 'Generating...' : 'Generate Lesson Plan'}
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
            <button 
              onClick={handleDownloadPDF}
              className="home-button primary"
              style={{ marginLeft: '1rem' }}
            >
              Download PDF
            </button>
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
          <li>Download as a PDF for easy printing and sharing</li>
        </ol>
      </section>
    </>
  );
} 