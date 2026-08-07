export type GenerationMode = 'auto' | 'semi' | 'prompting';

export type AgentType = 
  | 'orchestrator' 
  | 'research' 
  | 'education' 
  | 'visualization' 
  | 'designer' 
  | 'reviewer';

export type AgentStatus = 'idle' | 'thinking' | 'working' | 'completed' | 'error';

export interface AgentStep {
  id: string;
  agent: AgentType;
  title: string;
  description: string;
  status: AgentStatus;
  outputSummary?: string;
  timestamp: string;
  details?: string[];
}

export interface Diagram {
  id: string;
  title: string;
  type: 'flowchart' | 'timeline' | 'infographic' | 'comparison' | 'concept_map';
  svgContent?: string;
  caption: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint?: string;
}

export interface Flashcard {
  id: string;
  term: string;
  definition: string;
  example?: string;
}

export interface GlossaryItem {
  term: string;
  definition: string;
  category?: string;
}

export interface InteractiveWidget {
  type: 'interactive_demo' | 'formula_calculator' | 'step_by_step' | 'quiz_challenge' | 'js_animation';
  title: string;
  description: string;
  data: Record<string, any>;
  customHTML?: string;
  customJS?: string;
}

export interface Section {
  id: string;
  title: string;
  content: string; // Rich markdown or text with formatted explanations
  keyTakeaways: string[];
  diagrams?: Diagram[];
  quizzes?: QuizQuestion[];
  codeSnippets?: { language: string; code: string; explanation: string }[];
  interactiveWidget?: InteractiveWidget;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  subtitle?: string;
  summary: string;
  estimatedReadTimeMinutes: number;
  sections: Section[];
}

export interface EbookData {
  id: string;
  topic: string;
  subtitle: string;
  description: string;
  mode: GenerationMode;
  targetAudience: string;
  theme: 'nordic' | 'cyberpunk' | 'academic' | 'dark_mode' | 'emerald' | 'warm_amber';
  author: string;
  createdAt: string;
  chapters: Chapter[];
  flashcards: Flashcard[];
  glossary: GlossaryItem[];
  overallQuiz: QuizQuestion[];
  references: { title: string; url?: string; description: string }[];
  metadata: {
    totalReadTime: number;
    animationLevel: 'subtle' | 'moderate' | 'rich';
    depth: string;
    teachingStyle: string;
    language?: string;
  };
}

export interface GenerationConfig {
  topic: string;
  description: string;
  mode: GenerationMode;
  answers?: {
    targetAudience?: string;
    length?: 'short' | 'medium' | 'comprehensive';
    includeQuizzes?: boolean;
    animationLevel?: 'subtle' | 'moderate' | 'rich';
    colorTheme?: string;
  };
  promptingParams?: {
    teachingStyle?: string;
    visualStyle?: string;
    colorPalette?: string;
    animationLevel?: string;
    depth?: string;
    quizTypes?: string;
    diagramTypes?: string;
    examplesCount?: string;
    language?: string;
  };
}

export interface IterationRequest {
  ebookId: string;
  instruction: string;
  targetChapterId?: string;
  targetSectionId?: string;
}
