# Clifford Classroom

A minimalist educational resource website using Next.js, React Context for global state management, and a clean, user-friendly design.

## Features

- **Clean, Minimalist Design**: White backgrounds with dark green accents
- **Top Navigation Bar**: With dropdown submenus for easy section access
- **Global State Management**: Using React Context API
- **Responsive Layout**: Works on all screen sizes
- **Theme Toggle**: Switch between light and dark modes
- **User Authentication**: Simple login/logout functionality
- **Global Notifications**: System-wide notification handling
- **AI Lesson Plan Generator**: Create and download custom lesson plans with OpenAI integration

## Sections

- **Home**: Welcome page and overview
- **Digital/Tech Resources**: Educational technology tools and digital resources
- **Ed News**: Latest updates in educational trends and research
- **Brain & Development**: Content related to neuroscience and learning
- **Meme Tracker**: Educational memes and trending content
- **CliffTech Software**: Educational tools and software solutions
- **Lesson Plan Generator**: AI-powered tool to create customized lesson plans

## Project Structure

- `src/app`: Next.js app router pages
- `src/components`: Reusable UI components
- `src/context`: Global state management with Context API
- `public`: Static assets

## Getting Started

### Prerequisites

- Node.js 16.0.0 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd clifford-classroom
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the site.

## Customization

- Edit the navigation items in `src/components/NavBar.tsx`
- Modify color themes in `src/app/globals.css`
- Add new pages in the `src/app` directory following the Next.js app router convention

## Deployment

Ready to deploy your website? Follow the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## AI Lesson Plan Generator

The website includes a powerful AI-powered lesson plan generator that allows educators to create custom lesson plans in seconds.

### Features

- Create detailed, standards-aligned lesson plans
- Customize by grade level, subject, and topic
- Download as professionally formatted PDFs
- Includes all essential lesson plan components

### Setup

1. Create a `.env.local` file in the root directory based on `.env.local.example`
2. Add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_key_here
   ```
   
3. Restart the development server

### Usage

1. Navigate to the Lesson Plan Generator page
2. Fill in the required fields (Grade Level, Subject, and Topic)
3. Add optional fields like Standards and Learning Objectives
4. Click "Generate Lesson Plan"
5. Review the generated lesson plan
6. Download as PDF for printing or sharing

### Technologies Used

- OpenAI GPT-4 API for content generation
- jsPDF for PDF creation and formatting
- React Markdown for rendering formatted content
