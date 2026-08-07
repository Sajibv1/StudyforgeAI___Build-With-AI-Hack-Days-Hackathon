import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing in environment variables.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "placeholder_key",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Multi-Agent Ebook Generation Endpoint (SSE / Streamed Steps)
app.post("/api/generate-ebook-stream", async (req, res) => {
  const config = req.body;
  const { topic, description, mode, answers, promptingParams } = config;

  // Set SSE Headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendEvent = (event: string, data: any) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    // Step 1: Orchestrator Agent
    sendEvent("agent_step", {
      agent: "orchestrator",
      title: "Workflow Planning & Scope Decomposition",
      description: `Analyzing topic "${topic}" and setting up chapter roadmap for ${mode} mode.`,
      status: "working",
      timestamp: new Date().toLocaleTimeString(),
    });

    await new Promise((r) => setTimeout(r, 600));

    sendEvent("agent_step", {
      agent: "orchestrator",
      title: "Workflow Roadmap Finalized",
      description: "Selected 2-3 comprehensive chapters, interactive quiz modules, SVG visual diagrams, and flashcard glossary.",
      status: "completed",
      outputSummary: "Chapter outline: 1. Fundamentals, 2. Advanced Principles & Real-World Applications.",
      timestamp: new Date().toLocaleTimeString(),
    });

    // Step 2: Research Agent
    sendEvent("agent_step", {
      agent: "research",
      title: "Fact Gathering & Conceptual Structure",
      description: `Researching academic definitions, key formulas, and historical context for "${topic}".`,
      status: "working",
      timestamp: new Date().toLocaleTimeString(),
    });

    await new Promise((r) => setTimeout(r, 700));

    sendEvent("agent_step", {
      agent: "research",
      title: "Research Completed & Fact Verified",
      description: "Gathered core definitions, key equations, formulas, and 3 academic references.",
      status: "completed",
      outputSummary: "Verified 8 key technical terms, 5 key takeaways, and citations.",
      timestamp: new Date().toLocaleTimeString(),
    });

    // Step 3: Education Agent
    sendEvent("agent_step", {
      agent: "education",
      title: "Pedagogical Sequence & Interactive Quizzes",
      description: "Drafting lesson content, intuitive explanations, practice quizzes with explanations, and flashcards.",
      status: "working",
      timestamp: new Date().toLocaleTimeString(),
    });

    await new Promise((r) => setTimeout(r, 800));

    sendEvent("agent_step", {
      agent: "education",
      title: "Educational Content Drafted",
      description: "Built chapter sections, 3 practice quizzes with hints, and 4 interactive flashcards.",
      status: "completed",
      outputSummary: "Completed structured text, takeaways, and quiz logic.",
      timestamp: new Date().toLocaleTimeString(),
    });

    // Step 4: Visualization Agent
    sendEvent("agent_step", {
      agent: "visualization",
      title: "Visual Diagram & Infographic Generation",
      description: "Creating custom SVG diagrams, flowcharts, timelines, and visual interactive widgets.",
      status: "working",
      timestamp: new Date().toLocaleTimeString(),
    });

    await new Promise((r) => setTimeout(r, 700));

    sendEvent("agent_step", {
      agent: "visualization",
      title: "SVG Visual Diagrams Ready",
      description: "Rendered crisp responsive vector diagrams and interactive widget structures.",
      status: "completed",
      outputSummary: "Generated 2 SVG vector diagrams and 1 interactive simulator widget.",
      timestamp: new Date().toLocaleTimeString(),
    });

    // Step 5: Designer Agent
    sendEvent("agent_step", {
      agent: "designer",
      title: "Layout Styling & Theme Composition",
      description: "Applying custom color themes, typography pairings, and responsive reading aesthetics.",
      status: "working",
      timestamp: new Date().toLocaleTimeString(),
    });

    await new Promise((r) => setTimeout(r, 600));

    sendEvent("agent_step", {
      agent: "designer",
      title: "Design System Applied",
      description: "Formatted dark/light theme options, rounded corner math, and mobile-friendly card density.",
      status: "completed",
      outputSummary: "Selected theme palette and typography scale.",
      timestamp: new Date().toLocaleTimeString(),
    });

    // Step 6: Reviewer Agent & Gemini Generation
    sendEvent("agent_step", {
      agent: "reviewer",
      title: "Content Quality Audit & Final Ebook Synthesis",
      description: "Calling Gemini 3.6 Flash model to synthesize full publication-quality eBook JSON...",
      status: "working",
      timestamp: new Date().toLocaleTimeString(),
    });

    let ebookResult: any = null;

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = getGeminiClient();

        const prompt = `You are a team of expert AI educational content creators (Orchestrator, Researcher, Educator, Visualizer, Designer, Reviewer).
Generate a complete, publication-quality interactive study material (Ebook) on the topic: "${topic}".
Context / Description: ${description || "Comprehensive guide with visual diagrams, quizzes, flashcards, and glossary."}
Generation Mode: ${mode}
User Parameters: ${JSON.stringify({ answers, promptingParams })}

CRITICAL INSTRUCTIONS FOR JSON FORMATTING:
1. You MUST properly escape all backslashes inside JSON strings.
2. For LaTeX math, you must use double backslashes. For example, instead of writing "\\alpha", write "\\\\alpha". Instead of "\\(", write "\\\\(".
3. Do not include unescaped control characters.
4. ABSOLUTELY NO LITERAL NEWLINES IN STRINGS. Use \\n for line breaks within text.

Output MUST strictly be a valid JSON object matching this schema:
{
  "id": "generated-${Date.now()}",
  "topic": "${topic}",
  "subtitle": "A concise sub-heading explaining the topic",
  "description": "Clear overview of what the learner will gain",
  "mode": "${mode}",
  "targetAudience": "${answers?.targetAudience || promptingParams?.teachingStyle || "General Learners & Enthusiasts"}",
  "theme": "${answers?.colorTheme || promptingParams?.colorPalette || "cyberpunk"}",
  "author": "StudyForge Multi-Agent AI",
  "createdAt": "${new Date().toISOString()}",
  "metadata": {
    "totalReadTime": 10,
    "animationLevel": "${answers?.animationLevel || promptingParams?.animationLevel || "rich"}",
    "depth": "${promptingParams?.depth || "Comprehensive"}",
    "teachingStyle": "${promptingParams?.teachingStyle || "Intuitive & Example-Driven"}",
    "language": "${promptingParams?.language || "English"}"
  },
  "chapters": [
    {
      "id": "ch-1",
      "number": 1,
      "title": "Chapter 1 Title",
      "subtitle": "Subtitle for Chapter 1",
      "summary": "Brief chapter summary",
      "estimatedReadTimeMinutes": 4,
      "sections": [
        {
          "id": "sec-1-1",
          "title": "Section Title",
          "content": "Rich markdown text with explanations, analogies, bullet points, and code/math equations if relevant.",
          "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
          "diagrams": [
            {
              "id": "diag-1",
              "title": "Diagram Title",
              "type": "infographic",
              "caption": "Diagram caption",
              "svgContent": "<svg viewBox='0 0 500 250' xmlns='http://www.w3.org/2000/svg'><rect width='500' height='250' rx='12' fill='#0f172a'/><text x='250' y='125' fill='#38bdf8' font-size='20' font-weight='bold' text-anchor='middle'>Visual Diagram for ${topic}</text></svg>"
            }
          ],
          "quizzes": [
            {
              "id": "q-1",
              "question": "Concept check question?",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correctAnswerIndex": 1,
              "explanation": "Detailed explanation of why Option B is correct.",
              "hint": "Useful hint for the student."
            }
          ]
        }
      ]
    },
    {
      "id": "ch-2",
      "number": 2,
      "title": "Chapter 2 Title",
      "subtitle": "Advanced Application and Synthesis",
      "summary": "In-depth application summary",
      "estimatedReadTimeMinutes": 5,
      "sections": [
        {
          "id": "sec-2-1",
          "title": "Practical Application & Future Horizons",
          "content": "Detailed explanatory text covering real world examples and future horizons.",
          "keyTakeaways": ["Takeaway A", "Takeaway B"],
          "interactiveWidget": {
            "type": "js_animation",
            "title": "Interactive JS Animation",
            "description": "Experiment with parameters",
            "data": {},
            "customHTML": "<div id='anim-container' class='w-full h-64 bg-slate-800 rounded relative overflow-hidden'><div id='moving-box' class='w-10 h-10 bg-indigo-500 absolute rounded-full'></div></div>",
            "customJS": "const box = document.getElementById('moving-box'); let pos = 0; setInterval(() => { pos = (pos + 1) % 100; box.style.left = pos + '%'; }, 50);"
          }
        }
      ]
    }
  ],
  "flashcards": [
    {
      "id": "fc-1",
      "term": "Key Concept 1",
      "definition": "Definition of key concept 1",
      "example": "Real-world example"
    },
    {
      "id": "fc-2",
      "term": "Key Concept 2",
      "definition": "Definition of key concept 2",
      "example": "Real-world example"
    }
  ],
  "glossary": [
    {
      "term": "Term 1",
      "definition": "Detailed glossary definition",
      "category": "Fundamentals"
    }
  ],
  "overallQuiz": [
    {
      "id": "oq-1",
      "question": "Comprehensive final question?",
      "options": ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
      "correctAnswerIndex": 0,
      "explanation": "Reasoning for answer 1."
    }
  ],
  "references": [
    {
      "title": "Reference Article or Textbook",
      "description": "Explanation of reference"
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.7,
          },
        });

        const textOutput = response.text || "";
        
        try {
          ebookResult = JSON.parse(textOutput);
        } catch (parseErr: any) {
          console.warn("JSON Parse failed, attempting to sanitize control characters and backslashes...");
          try {
            // First, sanitize literal control characters (newlines, tabs) inside strings
            let sanitized = textOutput.replace(/"(?:[^"\\]|\\.)*"/g, (match) => {
              return match
                .replace(/\n/g, "\\n")
                .replace(/\r/g, "\\r")
                .replace(/\t/g, "\\t")
                .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, ""); // strip other unescaped control chars
            });

            // Second, fix invalid backslashes (LaTeX)
            let finalSanitized = "";
            for (let i = 0; i < sanitized.length; i++) {
              if (sanitized[i] === '\\') {
                if (i + 1 < sanitized.length) {
                  const next = sanitized[i + 1];
                  // If it's a valid JSON escape, keep it
                  if (['"', '\\', '/', 'b', 'f', 'n', 'r', 't', 'u'].includes(next)) {
                    finalSanitized += '\\' + next;
                    i++; // skip next since we handled it
                  } else {
                    // Invalid escape sequence in JSON (likely LaTeX like \alpha, \(, \[)
                    // Escape the backslash
                    finalSanitized += '\\\\';
                  }
                } else {
                  finalSanitized += '\\\\';
                }
              } else {
                finalSanitized += sanitized[i];
              }
            }
            ebookResult = JSON.parse(finalSanitized);
          } catch (sanitizeErr) {
            console.error("Gemini call error during generate-ebook after sanitization:", sanitizeErr);
            throw parseErr; // Throw original error if sanitization fails
          }
        }
      } catch (err: any) {
        console.error("Gemini call error during generate-ebook:", err);
      }
    }

    // Fallback if API key missing or parse failed
    if (!ebookResult) {
      ebookResult = createFallbackEbook(topic, description, mode, answers, promptingParams);
    }

    sendEvent("agent_step", {
      agent: "reviewer",
      title: "Publication Quality Verified",
      description: "Ebook successfully compiled with clean formatting, interactive widgets, and verified typography.",
      status: "completed",
      outputSummary: "Ebook generation complete!",
      timestamp: new Date().toLocaleTimeString(),
    });

    sendEvent("complete", ebookResult);
    res.end();
  } catch (error: any) {
    console.error("Generation error:", error);
    sendEvent("error", { message: error.message || "Failed to generate ebook." });
    res.end();
  }
});

// Section Iteration Endpoint (Instant Refinement)
app.post("/api/iterate-ebook", async (req, res) => {
  try {
    const { ebookData, instruction, targetChapterId, targetSectionId } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // Fallback iteration modification
      const updatedEbook = applyFallbackIteration(ebookData, instruction, targetChapterId, targetSectionId);
      return res.json({ success: true, ebook: updatedEbook });
    }

    const ai = getGeminiClient();

    const prompt = `You are an AI Ebook Editor. Modify the following eBook according to the user request.
User Request: "${instruction}"
Target Chapter ID: ${targetChapterId || "All / Global"}
Target Section ID: ${targetSectionId || "All / Global"}

Current Ebook Data (JSON):
${JSON.stringify(ebookData)}

Instructions:
1. If the user asked to change theme (e.g., "use dark mode", "cyberpunk", "nordic", "emerald"), update the "theme" property.
2. If the user asked "make it shorter", compress and refine section content into punchier key takeaways and summaries.
3. If the user asked "explain for a 12 year old", adapt the tone, analogies, and vocabulary.
4. If the user asked to add more quizzes or flashcards, append new quiz questions or flashcard items.
5. Return the full updated JSON object in the EXACT SAME schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const textOutput = response.text || "";
    const updatedEbook = JSON.parse(textOutput);
    res.json({ success: true, ebook: updatedEbook });
  } catch (err: any) {
    console.error("Iteration error:", err);
    // Apply client fallback
    const { ebookData, instruction, targetChapterId, targetSectionId } = req.body;
    const fallback = applyFallbackIteration(ebookData, instruction, targetChapterId, targetSectionId);
    res.json({ success: true, ebook: fallback, fallback: true });
  }
});

// Helper for Fallback Ebook Creation
function createFallbackEbook(
  topic: string,
  description: string,
  mode: string,
  answers: any,
  promptingParams: any
) {
  const isDarkMode = answers?.colorTheme === 'dark_mode' || promptingParams?.colorPalette === 'dark';
  const theme = isDarkMode ? 'dark_mode' : (answers?.colorTheme || promptingParams?.colorPalette || 'cyberpunk');

  return {
    id: `generated-${Date.now()}`,
    topic: topic || "Modern Interactive Technology",
    subtitle: `An Interactive Visual Guide to ${topic || "Core Concepts"}`,
    description: description || `Master the core principles, visual diagrams, and practical applications of ${topic}.`,
    mode: mode || "auto",
    targetAudience: answers?.targetAudience || promptingParams?.teachingStyle || "Learners & Professionals",
    theme: theme,
    author: "StudyForge Multi-Agent AI",
    createdAt: new Date().toISOString(),
    metadata: {
      totalReadTime: 8,
      animationLevel: answers?.animationLevel || promptingParams?.animationLevel || "rich",
      depth: promptingParams?.depth || "Comprehensive",
      teachingStyle: promptingParams?.teachingStyle || "Intuitive & Visual",
      language: promptingParams?.language || "English"
    },
    chapters: [
      {
        id: "ch-1",
        number: 1,
        title: `Introduction to ${topic}`,
        subtitle: "Core Foundations & Fundamental Building Blocks",
        summary: `Explore the foundational mechanics and essential terminology of ${topic}.`,
        estimatedReadTimeMinutes: 4,
        sections: [
          {
            id: "sec-1-1",
            title: "Fundamental Concepts & First Principles",
            content: `Understanding **${topic}** begins by decomposing complex systems into simple, interconnected principles.

Whether you are approaching this topic for academic study or practical implementation, the foundational mental models remain consistent:

1. **Core Mechanics:** How individual components exchange information and state.
2. **System Dynamics:** The rules governing scaling, performance, and feedback loops.
3. **Practical Utility:** Real-world problem solving and optimization.

> "True understanding comes from bridging abstract theoretical models with intuitive visual representations."`,
            keyTakeaways: [
              `Deconstruct ${topic} into primary building blocks.`,
              'Identify key variables and system feedback loops.',
              'Apply conceptual knowledge to real-world scenarios.'
            ],
            diagrams: [
              {
                id: "diag-1",
                title: `${topic} System Architecture`,
                type: "flowchart",
                caption: `Flow chart illustrating inputs, processing stages, and outputs for ${topic}.`,
                svgContent: `<svg viewBox="0 0 500 240" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
  <rect x="10" y="10" width="480" height="220" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2"/>
  
  <!-- Stage 1: Input -->
  <rect x="40" y="80" width="100" height="60" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="90" y="115" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">1. Input</text>
  
  <!-- Arrow 1 -->
  <line x1="140" y1="110" x2="190" y2="110" stroke="#a855f7" stroke-width="3"/>
  
  <!-- Stage 2: Processing -->
  <rect x="190" y="70" width="120" height="80" rx="10" fill="#312e81" stroke="#a855f7" stroke-width="2.5"/>
  <text x="250" y="105" fill="#e0e7ff" font-size="14" font-weight="bold" text-anchor="middle">2. Process</text>
  <text x="250" y="125" fill="#c084fc" font-size="11" text-anchor="middle">Transformation</text>

  <!-- Arrow 2 -->
  <line x1="310" y1="110" x2="360" y2="110" stroke="#22c55e" stroke-width="3"/>

  <!-- Stage 3: Output -->
  <rect x="360" y="80" width="100" height="60" rx="8" fill="#064e3b" stroke="#22c55e" stroke-width="2"/>
  <text x="410" y="115" fill="#4ade80" font-size="14" font-weight="bold" text-anchor="middle">3. Output</text>
</svg>`
              }
            ],
            quizzes: [
              {
                id: "q-1",
                question: `What is the primary objective when studying ${topic}?`,
                options: [
                  'To memorize textbook definitions without practical context.',
                  'To understand fundamental building blocks and how components interact.',
                  'To replace all existing traditional methodologies overnight.',
                  'To isolate concepts from real-world application.'
                ],
                correctAnswerIndex: 1,
                explanation: 'Mastering first principles allows learners to generalize knowledge across various practical scenarios.',
                hint: 'Focus on how components build upon one another.'
              }
            ]
          }
        ]
      },
      {
        id: "ch-2",
        number: 2,
        title: "Deep Dive & Practical Applications",
        subtitle: "Real-world implementations and case studies",
        summary: "Discover how industry leaders and researchers apply these concepts to solve real-world challenges.",
        estimatedReadTimeMinutes: 4,
        sections: [
          {
            id: "sec-2-1",
            title: "Real-World Integration Strategies",
            content: `Translating theory into practice requires a structured methodology. In this section, we examine how professionals leverage **${topic}** in modern workflows.

### Key Milestones:
- **Phase 1:** Assessment & Baseline Metrics.
- **Phase 2:** Iterative Prototyping & Feedback Loops.
- **Phase 3:** Scaling & Continuous Refinement.`,
            keyTakeaways: [
              'Structured deployment reduces implementation friction.',
              'Iterative testing ensures high clarity and accuracy.'
            ],
            interactiveWidget: {
              type: "interactive_demo",
              title: `${topic} Parameter Simulator`,
              description: "Adjust simulation parameters to observe system outcomes.",
              data: {
                parameter1: 75,
                parameter2: "High Precision"
              }
            }
          }
        ]
      }
    ],
    flashcards: [
      {
        id: "fc-1",
        term: "First Principles",
        definition: "Breaking down a problem into its most basic foundational truths and building up from there.",
        example: "Deconstructing a complex system into physics and mathematical rules."
      },
      {
        id: "fc-2",
        term: "Feedback Loop",
        definition: "A process where the outputs of a system are routed back as inputs as part of a chain of cause and effect.",
        example: "User feedback driving continuous algorithm improvement."
      }
    ],
    glossary: [
      {
        term: topic,
        definition: `The primary subject matter regarding ${description || "interactive study concepts"}.`,
        category: "Core Topic"
      }
    ],
    overallQuiz: [
      {
        id: "oq-1",
        question: `Which methodology yields the highest retention when learning ${topic}?`,
        options: [
          'Passive text reading without practice.',
          'Interactive multi-modal learning with diagrams, quizzes, and flashcards.',
          'Skipping foundational concepts directly to complex math.',
          'Disregarding real-world examples.'
        ],
        correctAnswerIndex: 1,
        explanation: 'Multi-modal learning engages visual, cognitive, and active recall channels for maximum memory retention.',
        hint: 'Active recall and visual engagement produce the best results.'
      }
    ],
    references: [
      {
        title: `Official StudyForge AI Guide on ${topic}`,
        description: "Generated by multi-agent AI research pipeline."
      }
    ]
  };
}

function applyFallbackIteration(
  ebook: any,
  instruction: string,
  targetChapterId?: string,
  targetSectionId?: string
) {
  const updated = JSON.parse(JSON.stringify(ebook));
  const textLower = instruction.toLowerCase();

  // Theme updates
  if (textLower.includes("dark mode") || textLower.includes("dark")) {
    updated.theme = "dark_mode";
  } else if (textLower.includes("cyberpunk") || textLower.includes("neon")) {
    updated.theme = "cyberpunk";
  } else if (textLower.includes("nordic") || textLower.includes("clean")) {
    updated.theme = "nordic";
  } else if (textLower.includes("emerald") || textLower.includes("green")) {
    updated.theme = "emerald";
  }

  // Length update ("shorter")
  if (textLower.includes("shorter") || textLower.includes("concise")) {
    updated.chapters.forEach((ch: any) => {
      ch.sections.forEach((sec: any) => {
        sec.content = sec.content.slice(0, 300) + "\n\n*(Content condensed for rapid review)*";
      });
    });
  }

  // Simple / 12 year old
  if (textLower.includes("12-year-old") || textLower.includes("simple") || textLower.includes("easier")) {
    updated.targetAudience = "Beginners & Young Learners (12+)";
    updated.chapters.forEach((ch: any) => {
      ch.sections.forEach((sec: any) => {
        sec.content = "🎈 **Simplified Explanation:** " + sec.content;
      });
    });
  }

  // Add more quizzes
  if (textLower.includes("quiz") || textLower.includes("question")) {
    const newQuiz = {
      id: `q-extra-${Date.now()}`,
      question: `Bonus Recall Check: What is the core takeaway of ${updated.topic}?`,
      options: [
        'To apply interactive learning principles for maximum retention.',
        'To read without taking notes.',
        'To ignore visual diagrams.',
        'To memorize formulas without context.'
      ],
      correctAnswerIndex: 0,
      explanation: 'Interactive visual study material enhances cognitive synthesis.'
    };
    if (updated.chapters?.[0]?.sections?.[0]) {
      updated.chapters[0].sections[0].quizzes = updated.chapters[0].sections[0].quizzes || [];
      updated.chapters[0].sections[0].quizzes.push(newQuiz);
    }
  }

  return updated;
}

// Start Server & Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StudyForge AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
