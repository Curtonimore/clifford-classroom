import { jsPDF } from 'jspdf';

interface LessonPlanMetadata {
  standards: string;
  audience: string;
  time: string;
  subject: string;
  topic: string;
  objectives: string;
  generatedAt: string;
}

export function generateLessonPlanPDF(lessonPlan: string, metadata: LessonPlanMetadata) {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20; // margin in mm
  const textWidth = pageWidth - (margin * 2);
  
  // Add header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Clifford Classroom - Lesson Plan', pageWidth / 2, margin, { align: 'center' });
  
  // Add metadata section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Topic: ${metadata.topic}`, margin, margin + 10);
  doc.text(`Grade Level: ${metadata.audience}`, margin, margin + 15);
  doc.text(`Subject: ${metadata.subject}`, margin, margin + 20);
  doc.text(`Duration: ${metadata.time}`, margin, margin + 25);
  doc.text(`Standards: ${metadata.standards}`, margin, margin + 30);
  doc.text(`Objectives: ${metadata.objectives}`, margin, margin + 35);
  
  doc.text(`Generated: ${new Date(metadata.generatedAt).toLocaleString()}`, margin, margin + 40);
  
  // Add a separator line
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(margin, margin + 45, pageWidth - margin, margin + 45);
  
  // Add lesson plan content
  doc.setFontSize(11);
  
  // Split the text to respect line breaks
  const paragraphs = lessonPlan.split('\n');
  let yPosition = margin + 50;
  
  for (const paragraph of paragraphs) {
    // Skip empty paragraphs
    if (paragraph.trim() === '') {
      yPosition += 5;
      continue;
    }
    
    // Handle headings (lines starting with #)
    if (paragraph.startsWith('#')) {
      const headingMatch = paragraph.match(/^#+/);
      const level = headingMatch ? headingMatch[0].length : 1;
      const text = paragraph.replace(/^#+\s+/, '');
      
      // Adjust font size based on heading level
      if (level === 1) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
      } else if (level === 2) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
      }
      
      // Add a bit more space before headings
      yPosition += 5;
      
      // Check if we need a new page
      if (yPosition > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPosition = margin;
      }
      
      doc.text(text, margin, yPosition);
      yPosition += 7;
      
      // Reset font
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      continue;
    }
    
    // Handle bullet points
    if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
      const text = paragraph.substring(2);
      const splitText = doc.splitTextToSize(text, textWidth - 10);
      
      // Check if we need a new page
      if (yPosition + (splitText.length * 5) > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPosition = margin;
      }
      
      doc.text('•', margin, yPosition);
      doc.text(splitText, margin + 5, yPosition);
      yPosition += splitText.length * 5;
      continue;
    }
    
    // Handle numbered lists
    if (/^\d+\.\s/.test(paragraph)) {
      const text = paragraph;
      const splitText = doc.splitTextToSize(text, textWidth);
      
      // Check if we need a new page
      if (yPosition + (splitText.length * 5) > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPosition = margin;
      }
      
      doc.text(splitText, margin, yPosition);
      yPosition += splitText.length * 5;
      continue;
    }
    
    // Regular paragraph
    const splitText = doc.splitTextToSize(paragraph, textWidth);
    
    // Check if we need a new page
    if (yPosition + (splitText.length * 5) > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      yPosition = margin;
    }
    
    doc.text(splitText, margin, yPosition);
    yPosition += splitText.length * 5;
  }
  
  // Add footer with page numbers
  const pageCount = doc.getNumberOfPages ? doc.getNumberOfPages() : doc.internal.pages.length - 1;
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  }
  
  // Save the file with a clean filename
  const filename = `lesson-plan-${metadata.subject.replace(/\s+/g, '-')}-${metadata.topic.replace(/\s+/g, '-')}`.toLowerCase();
  doc.save(`${filename}.pdf`);
  
  return filename;
} 