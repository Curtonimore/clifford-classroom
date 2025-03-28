'use client'

import React, { useRef, useState } from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import './lesson-plan.css'

// Define props for this component
export interface LessonPlanViewerProps {
  content: string
  title?: string
  date?: string
  grade?: string
  duration?: string
  objectives?: string
  subject?: string
}

// Define a structure for our parsed sections
interface Section {
  title: string
  content: string[]
}

// Parse content into sections
const parseSections = (content: string): Section[] => {
  if (!content || content.trim() === '') {
    return [];
  }

  const lines = content.split('\n').filter(line => line.trim() !== '');
  const sections: Section[] = [];
  let currentSection: Section | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (!trimmedLine.startsWith('•') && !trimmedLine.startsWith('-') && !trimmedLine.startsWith(' ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = { title: trimmedLine, content: [] };
    } else if (currentSection) {
      currentSection.content.push(trimmedLine);
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
};

// Main component
export default function LessonPlanViewer(props: LessonPlanViewerProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Parse the content into sections
  const sections = parseSections(props.content || '');
  
  // Function to generate and download PDF
  const handleDownload = async () => {
    if (!contentRef.current) return;
    
    try {
      setIsDownloading(true);
      
      const element = contentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // A4 dimensions in mm: 210×297
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; 
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add new pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const filename = `${props.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'lesson_plan'}.pdf`;
      pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!props.content) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-brand">Lesson Plan Preview</h2>
          <button
            disabled
            className="bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed"
          >
            Download PDF
          </button>
        </div>
        <div className="h-[800px] w-full bg-white border border-gray-200 flex items-center justify-center">
          <div className="text-gray-500">No content to preview</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-brand">Lesson Plan Preview</h2>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`bg-brand hover:bg-brand-light text-white px-4 py-2 rounded-md transition-colors ${
            isDownloading ? 'opacity-70 cursor-wait' : ''
          }`}
        >
          {isDownloading ? 'Processing...' : 'Download PDF'}
        </button>
      </div>
      
      {/* Scrollable preview container */}
      <div className="h-[800px] w-full bg-white border border-gray-200 overflow-auto p-8">
        {/* Actual content to be converted to PDF */}
        <div 
          ref={contentRef} 
          className="bg-white mx-auto lesson-plan-content" 
          style={{
            maxWidth: '800px'
          }}
        >
          {/* Header section */}
          <div className="info-box">
            <h1 className="text-3xl font-bold text-center mb-6">{props.title || 'Lesson Plan'}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex">
                <span className="font-bold text-brand w-32">Date:</span>
                <span>{props.date || new Date().toLocaleDateString()}</span>
              </div>
              
              <div className="flex">
                <span className="font-bold text-brand w-32">Grade Level:</span>
                <span>{props.grade || 'N/A'}</span>
              </div>
              
              <div className="flex">
                <span className="font-bold text-brand w-32">Subject:</span>
                <span>{props.subject || 'N/A'}</span>
              </div>
              
              <div className="flex">
                <span className="font-bold text-brand w-32">Duration:</span>
                <span>{props.duration || 'N/A'}</span>
              </div>
              
              <div className="flex col-span-1 md:col-span-2">
                <span className="font-bold text-brand w-32">Objectives:</span>
                <span>{props.objectives || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          {/* Content sections */}
          {sections.map((section, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-xl font-bold border-b border-gray-200 pb-2 mb-4">
                {section.title}
              </h2>
              
              <div className="space-y-3">
                {section.content.map((line, lineIndex) => {
                  const isIndented = line.startsWith(' ') || line.startsWith('\t');
                  const isBullet = line.startsWith('•') || line.startsWith('-');
                  
                  return (
                    <div 
                      key={lineIndex} 
                      className={`${isIndented || isBullet ? 'bullet-point' : ''}`}
                    >
                      {isBullet ? (
                        <div className="flex">
                          <span className="bullet-marker">•</span>
                          <span>{line.replace(/^[-•]/, '').trim()}</span>
                        </div>
                      ) : (
                        <p>{line}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          {/* Footer */}
          <div className="text-center text-sm text-brand mt-12 pt-4 border-t border-gray-200">
            Generated by Clifford Classroom
          </div>
        </div>
      </div>
    </div>
  );
} 