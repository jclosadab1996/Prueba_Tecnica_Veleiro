# File Management & Intake System

A modern, AI-powered file management system built with Next.js, featuring drag-and-drop uploads, inline editing, and intelligent file processing using Google Gemini AI.

## 🚀 Features

- **File Upload & Management**
  - Drag & drop file uploads
  - Support for multiple file types (.txt, .pdf, .csv, .xlsx, .js, .ts, .html, .css, .json, .md)
  - Hierarchical folder structure
  - File search and filtering

- **Inline Editing**
  - Built-in editor for text and code files
  - Syntax highlighting mode
  - Real-time save functionality
  - Undo/redo capabilities

- **AI Processing**
  - Google Gemini integration for file analysis
  - Automatic metadata extraction
  - Named entity recognition
  - Content summarization
  - Language detection

- **Modern UI/UX**
  - Responsive design
  - Beautiful animations and transitions
  - Drag & drop interface
  - Context menus and modals
  - Dark mode support

## 🛠️ Tech Stack

### Frontend
- **Next.js 13** - React framework with app router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons
- **Zustand** - State management

### Backend
- **Next.js API Routes** - Serverless functions
- **Google Gemini AI** - File processing and analysis

### Data Storage
- **Zustand Persist** - Local storage for file data
- **Browser File System** - File content storage

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   └── process-file/
│   │       └── route.ts          # Gemini API integration
│   ├── globals.css               # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main application
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── CreateFolderDialog.tsx   # Folder creation modal
│   ├── FileEditor.tsx           # Inline file editor
│   ├── FileTree.tsx             # File/folder tree view
│   ├── FileUpload.tsx           # Drag & drop upload
│   └── FileViewer.tsx           # File preview component
├── lib/
│   └── utils.ts                 # Utility functions
├── store/
│   └── fileStore.ts             # Zustand store
└── README.md
```

## 🔧 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd file-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🏗️ Architecture

### Frontend Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   File Upload   │    │   File Tree     │    │   File Editor   │
│   Component     │    │   Component     │    │   Component     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                  ┌─────────────────┐
                  │  Zustand Store  │
                  │  (File State)   │
                  └─────────────────┘
```

### Backend Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js API   │    │   Google        │    │   File System   │
│   Routes        │───▶│   Gemini AI     │    │   (Browser)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🌐 API Contract

### POST /api/process-file
Processes file content using Google Gemini AI.

**Request:**
```json
{
  "content": "string",
  "fileName": "string",
  "fileType": "string"
}
```

**Response:**
```json
{
  "language": "string",
  "lineCount": "number",
  "entities": ["string"],
  "themes": ["string"],
  "summary": "string"
}
```

## 🧪 Testing

Currently, the application includes:
- Component-level testing capabilities
- TypeScript type checking
- ESLint code quality checks

To run tests:
```bash
npm run lint
npm run build
```

## 🔮 Future Enhancements

- Database integration (PostgreSQL/Supabase)
- User authentication and permissions
- Real-time collaboration
- Advanced file previews (PDF, images)
- Export/import functionality
- Version control for files
- Advanced search with filters
- File sharing capabilities

## 📝 Development Notes

This project was built using AI-assisted development with multiple LLM interactions. The complete chat history and development process are documented in the repository.

### Key Design Decisions

1. **Client-side storage**: Used Zustand with persistence for rapid prototyping
2. **Component architecture**: Modular components for maintainability
3. **AI integration**: Google Gemini for intelligent file processing
4. **UI framework**: shadcn/ui for consistent, accessible components
5. **State management**: Zustand for simple, effective state management

## 🚀 Deployment

The application requires server-side rendering for API routes to function properly:

```bash
npm run build
npm start
```

For deployment to platforms like Vercel, Netlify Functions, or other Node.js hosting services, the API routes will work automatically.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.