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

## Sections

- **Home**: Welcome page and overview
- **Digital/Tech Resources**: Educational technology tools and digital resources
- **Ed News**: Latest updates in educational trends and research
- **Brain & Development**: Content related to neuroscience and learning
- **Meme Tracker**: Educational memes and trending content
- **CliffTech Software**: Educational tools and software solutions

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
