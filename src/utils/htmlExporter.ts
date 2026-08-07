import { EbookData } from '../types';

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeJsString(str: string): string {
  if (!str) return '';
  return str.replace(/`/g, '\\`').replace(/\\/g, '\\\\').replace(/\${/g, '\\${');
}

function protectMath(text: string): { protectedText: string; mathBlocks: string[] } {
  const mathBlocks: string[] = [];
  if (!text) return { protectedText: '', mathBlocks };

  // 1. Display math $$ ... $$
  let protectedText = text.replace(/\$\$(\s\S*?)\$\$/g, (match) => {
    const idx = mathBlocks.length;
    mathBlocks.push(match);
    return `___MATH_BLOCK_${idx}___`;
  });

  // 2. Display math \[ ... \]
  protectedText = protectedText.replace(/\\\[([\s\S]*?)\\\]/g, (match) => {
    const idx = mathBlocks.length;
    mathBlocks.push(match);
    return `___MATH_BLOCK_${idx}___`;
  });

  // 3. Inline math \( ... \)
  protectedText = protectedText.replace(/\\\(([\s\S]*?)\\\)/g, (match) => {
    const idx = mathBlocks.length;
    mathBlocks.push(match);
    return `___MATH_BLOCK_${idx}___`;
  });

  // 4. Inline math $ ... $
  protectedText = protectedText.replace(/\$([^\$\n]+?)\$/g, (match) => {
    const idx = mathBlocks.length;
    mathBlocks.push(match);
    return `___MATH_BLOCK_${idx}___`;
  });

  return { protectedText, mathBlocks };
}

function restoreMath(html: string, mathBlocks: string[]): string {
  return html.replace(/___MATH_BLOCK_(\d+)___/g, (_, idxStr) => {
    const rawMath = mathBlocks[parseInt(idxStr, 10)] || '';
    // Safely replace < and > in math so HTML structure isn't broken
    return rawMath.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  });
}

function renderMarkdownInline(text: string | undefined | null): string {
  if (!text) return '';
  
  const { protectedText, mathBlocks } = protectMath(text);
  let str = escapeHtml(protectedText);

  // Bold
  str = str.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic
  str = str.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Inline code
  str = str.replace(/`(.*?)`/g, '<code class="bg-slate-800 text-indigo-300 px-1 py-0.5 rounded font-mono text-xs">$1</code>');

  return restoreMath(str, mathBlocks);
}

function renderMarkdown(text: string | undefined | null): string {
  if (!text) return '';

  const { protectedText, mathBlocks } = protectMath(text);
  const lines = protectedText.split(/\r?\n/);
  const result: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;

  function closeList() {
    if (inList && listType) {
      result.push(listType === 'ul' ? '</ul>' : '</ol>');
      inList = false;
      listType = null;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      closeList();
      continue;
    }

    // Headers
    if (line.startsWith('### ')) {
      closeList();
      result.push(`<h3 class="text-lg font-bold text-white mt-4 mb-2">${renderMarkdownInline(line.slice(4))}</h3>`);
    } else if (line.startsWith('## ')) {
      closeList();
      result.push(`<h2 class="text-xl font-bold text-white mt-5 mb-3">${renderMarkdownInline(line.slice(3))}</h2>`);
    } else if (line.startsWith('# ')) {
      closeList();
      result.push(`<h1 class="text-2xl font-bold text-white mt-6 mb-4">${renderMarkdownInline(line.slice(2))}</h1>`);
    } 
    // Unordered List
    else if (line.startsWith('* ') || line.startsWith('- ')) {
      if (!inList || listType !== 'ul') {
        closeList();
        inList = true;
        listType = 'ul';
        result.push('<ul class="list-disc pl-5 my-3 space-y-1 text-slate-300">');
      }
      result.push(`<li>${renderMarkdownInline(line.slice(2))}</li>`);
    }
    // Ordered List
    else if (/^\d+\.\s/.test(line)) {
      if (!inList || listType !== 'ol') {
        closeList();
        inList = true;
        listType = 'ol';
        result.push('<ol class="list-decimal pl-5 my-3 space-y-1 text-slate-300">');
      }
      const itemText = line.replace(/^\d+\.\s/, '');
      result.push(`<li>${renderMarkdownInline(itemText)}</li>`);
    }
    // Blockquote
    else if (line.startsWith('> ')) {
      closeList();
      result.push(`<blockquote class="border-l-4 border-indigo-500 pl-4 py-2 my-3 bg-slate-800/60 text-slate-300 italic text-sm rounded-r">${renderMarkdownInline(line.slice(2))}</blockquote>`);
    }
    // Standard paragraph
    else {
      closeList();
      result.push(`<p class="mb-3 leading-relaxed text-slate-300">${renderMarkdownInline(line)}</p>`);
    }
  }

  closeList();
  const html = result.join('\n');
  return restoreMath(html, mathBlocks);
}

export function generateSelfContainedHtml(ebook: EbookData): string {
  const jsonString = JSON.stringify(ebook);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(ebook.topic)} - StudyForge AI Interactive Ebook</title>

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <!-- MathJax Configuration & Engine for LaTeX Math rendering -->
  <script>
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
      }
    };
  </script>
  <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>

  <!-- KaTeX Fallback Engine -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    h1, h2, h3, .font-serif {
      font-family: 'Playfair Display', serif;
    }
    code, pre {
      font-family: 'JetBrains Mono', monospace;
    }

    .flashcard-inner {
      transition: transform 0.6s;
      transform-style: preserve-3d;
    }
    .flashcard.flipped .flashcard-inner {
      transform: rotateY(180deg);
    }
    .flashcard-front, .flashcard-back {
      backface-visibility: hidden;
    }
    .flashcard-back {
      transform: rotateY(180deg);
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen">

  <!-- Header / Navigation Bar -->
  <header class="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center font-bold text-slate-950 shadow-lg">
          SF
        </div>
        <div>
          <h1 class="text-lg font-bold text-white tracking-wide truncate max-w-md">${escapeHtml(ebook.topic)}</h1>
          <p class="text-xs text-indigo-400">StudyForge AI Interactive Ebook • ${escapeHtml(ebook.targetAudience)}</p>
        </div>
      </div>
      
      <div class="flex items-center space-x-2">
        <button onclick="switchTab('chapters')" id="tab-btn-chapters" class="px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 text-white">
          Book Reader
        </button>
        <button onclick="switchTab('flashcards')" id="tab-btn-flashcards" class="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 hover:text-white">
          Flashcards (${ebook.flashcards.length})
        </button>
        <button onclick="switchTab('glossary')" id="tab-btn-glossary" class="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 hover:text-white">
          Glossary (${ebook.glossary.length})
        </button>
        <button onclick="switchTab('quiz')" id="tab-btn-quiz" class="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 hover:text-white">
          Master Quiz
        </button>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 py-8">
    
    <!-- Hero Banner -->
    <div class="mb-8 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/20 relative overflow-hidden">
      <div class="relative z-10 max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
          ${escapeHtml(ebook.mode.toUpperCase())} MODE • ${escapeHtml(ebook.metadata.teachingStyle || 'Interactive Study Guide')}
        </div>
        <h2 class="text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">${escapeHtml(ebook.topic)}</h2>
        <p class="text-lg text-slate-300 mb-4">${renderMarkdownInline(ebook.subtitle)}</p>
        <div class="text-sm text-slate-400 leading-relaxed mb-6">${renderMarkdown(ebook.description)}</div>
        
        <div class="flex flex-wrap items-center gap-6 text-xs text-slate-400 pt-4 border-t border-slate-800">
          <div><span class="text-indigo-400 font-semibold">Author:</span> ${escapeHtml(ebook.author)}</div>
          <div><span class="text-indigo-400 font-semibold">Read Time:</span> ~${ebook.metadata.totalReadTime} mins</div>
          <div><span class="text-indigo-400 font-semibold">Chapters:</span> ${ebook.chapters.length}</div>
          <div><span class="text-indigo-400 font-semibold">Format:</span> Self-Contained Offline HTML</div>
        </div>
      </div>
    </div>

    <!-- Tab 1: Chapters View -->
    <div id="tab-content-chapters" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- Sidebar Navigation -->
      <aside class="lg:col-span-4 space-y-4">
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 sticky top-20">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Table of Contents</h3>
          <div class="space-y-2" id="toc-container">
            ${ebook.chapters.map((ch, chIdx) => `
              <div class="border border-slate-800 rounded-lg overflow-hidden">
                <button onclick="toggleChapterNav(${chIdx})" class="w-full text-left p-3 bg-slate-800/50 hover:bg-slate-800 flex items-center justify-between font-medium text-sm text-slate-200">
                  <span>Ch ${ch.number}. ${escapeHtml(ch.title)}</span>
                  <span class="text-xs text-indigo-400">~${ch.estimatedReadTimeMinutes}m</span>
                </button>
                <div id="chap-nav-list-${chIdx}" class="p-2 space-y-1 bg-slate-900/60 text-xs">
                  ${ch.sections.map((sec, secIdx) => `
                    <a href="#sec-${chIdx}-${secIdx}" class="block p-2 rounded text-slate-400 hover:text-indigo-300 hover:bg-slate-800/80 transition-colors">
                      • ${escapeHtml(sec.title)}
                    </a>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </aside>

      <!-- Main Reader Content -->
      <section class="lg:col-span-8 space-y-12">
        ${ebook.chapters.map((ch, chIdx) => `
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl relative" id="chapter-${chIdx}">
            <div class="flex items-center gap-3 mb-2">
              <span class="px-3 py-1 rounded-md bg-indigo-600/20 text-indigo-400 text-xs font-bold uppercase">Chapter ${ch.number}</span>
              <span class="text-xs text-slate-400">~${ch.estimatedReadTimeMinutes} min read</span>
            </div>
            <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">${escapeHtml(ch.title)}</h2>
            ${ch.subtitle ? `<p class="text-indigo-300 font-medium text-sm mb-4">${renderMarkdownInline(ch.subtitle)}</p>` : ''}
            <div class="text-sm text-slate-400 italic mb-6 p-3 rounded-lg bg-slate-800/40 border-l-2 border-indigo-500">${renderMarkdown(ch.summary)}</div>

            <!-- Sections -->
            <div class="space-y-8">
              ${ch.sections.map((sec, secIdx) => `
                <div id="sec-${chIdx}-${secIdx}" class="pt-6 border-t border-slate-800 space-y-4">
                  <h3 class="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                    ${escapeHtml(sec.title)}
                  </h3>

                  <div class="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed">
                    ${renderMarkdown(sec.content)}
                  </div>

                  <!-- Key Takeaways -->
                  ${sec.keyTakeaways && sec.keyTakeaways.length > 0 ? `
                    <div class="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20">
                      <h4 class="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Key Takeaways</h4>
                      <ul class="space-y-1 text-xs text-slate-300 list-disc list-inside">
                        ${sec.keyTakeaways.map(kt => `<li>${renderMarkdownInline(kt)}</li>`).join('')}
                      </ul>
                    </div>
                  ` : ''}

                  <!-- Visual Diagrams -->
                  ${sec.diagrams && sec.diagrams.length > 0 ? `
                    <div class="space-y-4 my-6">
                      ${sec.diagrams.map(diag => `
                        <div class="bg-slate-950 border border-slate-800 rounded-xl p-4">
                          <h4 class="text-sm font-semibold text-indigo-300 mb-2">${escapeHtml(diag.title)}</h4>
                          <div class="overflow-x-auto rounded-lg bg-slate-900/80 p-2 flex justify-center">
                            ${diag.svgContent || `<p class="text-xs text-slate-500">Diagram: ${escapeHtml(diag.title)}</p>`}
                          </div>
                          <div class="text-xs text-slate-400 mt-2 italic text-center">${renderMarkdownInline(diag.caption)}</div>
                        </div>
                      `).join('')}
                    </div>
                  ` : ''}

                  <!-- Interactive Widget -->
                  ${sec.interactiveWidget ? `
                    <div class="space-y-4 my-6 p-5 rounded-xl bg-slate-950 border border-slate-800">
                      <h4 class="text-sm font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                        Interactive: ${escapeHtml(sec.interactiveWidget.title)}
                      </h4>
                      <p class="text-xs text-slate-400 mb-4">${renderMarkdownInline(sec.interactiveWidget.description)}</p>
                      
                      ${sec.interactiveWidget.customHTML ? `
                        <div class="interactive-html-container w-full">
                          ${sec.interactiveWidget.customHTML}
                        </div>
                      ` : ''}
                      
                      ${sec.interactiveWidget.customJS ? `
                        <script>
                          (function() {
                            try {
                              ${sec.interactiveWidget.customJS}
                            } catch (e) {
                              console.error("Error running interactive widget JS:", e);
                            }
                          })();
                        </script>
                      ` : ''}
                    </div>
                  ` : ''}

                  <!-- Section Quiz -->
                  ${sec.quizzes && sec.quizzes.length > 0 ? `
                    <div class="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <h4 class="text-xs font-bold uppercase text-amber-400">Section Checkpoint</h4>
                      ${sec.quizzes.map((q, qIdx) => `
                        <div class="space-y-2" id="quiz-${chIdx}-${secIdx}-${qIdx}">
                          <div class="text-sm font-medium text-slate-200">${renderMarkdownInline(q.question)}</div>
                          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            ${q.options.map((opt, optIdx) => `
                              <button onclick="checkQuizAnswer('quiz-${chIdx}-${secIdx}-${qIdx}', ${optIdx}, ${q.correctAnswerIndex}, \`${escapeJsString(q.explanation)}\`)" 
                                      class="p-2.5 rounded-lg text-left text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700">
                                ${renderMarkdownInline(opt)}
                              </button>
                            `).join('')}
                          </div>
                          <div class="quiz-feedback hidden text-xs p-3 rounded-lg mt-2"></div>
                        </div>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </section>
    </div>

    <!-- Tab 2: Flashcards View -->
    <div id="tab-content-flashcards" class="hidden max-w-4xl mx-auto space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-white">Interactive Concept Flashcards</h2>
        <p class="text-sm text-slate-400">Click any card to flip and reveal definitions & examples.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${ebook.flashcards.map((fc, idx) => `
          <div onclick="this.classList.toggle('flipped')" class="flashcard h-52 cursor-pointer perspective-1000">
            <div class="flashcard-inner relative w-full h-full rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between shadow-xl hover:border-indigo-500/50 transition-all">
              <!-- Front -->
              <div class="flashcard-front absolute inset-0 p-6 flex flex-col justify-between rounded-2xl bg-slate-900">
                <span class="text-xs font-bold uppercase text-indigo-400">Flashcard #${idx + 1}</span>
                <div class="text-center">
                  <h3 class="text-xl font-extrabold text-white mb-2">${renderMarkdownInline(fc.term)}</h3>
                  <p class="text-xs text-slate-500">Tap to flip</p>
                </div>
                <div class="text-right text-xs text-slate-600">StudyForge AI</div>
              </div>
              <!-- Back -->
              <div class="flashcard-back absolute inset-0 p-6 flex flex-col justify-between rounded-2xl bg-indigo-950/80 border border-indigo-500/30">
                <div>
                  <span class="text-xs font-bold uppercase text-indigo-300">Definition</span>
                  <div class="text-sm text-slate-200 mt-2 leading-relaxed">${renderMarkdownInline(fc.definition)}</div>
                </div>
                ${fc.example ? `
                  <div class="pt-2 border-t border-indigo-500/20">
                    <p class="text-xs text-indigo-300"><strong>Example:</strong> ${renderMarkdownInline(fc.example)}</p>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Tab 3: Glossary View -->
    <div id="tab-content-glossary" class="hidden max-w-4xl mx-auto space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-white">Subject Glossary</h2>
        <p class="text-sm text-slate-400">Key terminology definitions and categorization.</p>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        ${ebook.glossary.map((gItem) => `
          <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
            <div class="flex items-center justify-between mb-1">
              <h3 class="text-base font-bold text-indigo-300">${renderMarkdownInline(gItem.term)}</h3>
              ${gItem.category ? `<span class="px-2 py-0.5 rounded text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">${escapeHtml(gItem.category)}</span>` : ''}
            </div>
            <div class="text-sm text-slate-300 leading-relaxed">${renderMarkdownInline(gItem.definition)}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Tab 4: Master Quiz View -->
    <div id="tab-content-quiz" class="hidden max-w-3xl mx-auto space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-white">Master Knowledge Assessment</h2>
        <p class="text-sm text-slate-400">Test your overall understanding across all chapters.</p>
      </div>

      <div class="space-y-6">
        ${(ebook.overallQuiz || []).map((q, qIdx) => `
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4" id="master-quiz-${qIdx}">
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">${qIdx + 1}</span>
              ${renderMarkdownInline(q.question)}
            </h3>

            <div class="space-y-2">
              ${q.options.map((opt, optIdx) => `
                <button onclick="checkQuizAnswer('master-quiz-${qIdx}', ${optIdx}, ${q.correctAnswerIndex}, \`${escapeJsString(q.explanation)}\`)"
                        class="w-full p-3 rounded-xl text-left text-sm bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors">
                  ${renderMarkdownInline(opt)}
                </button>
              `).join('')}
            </div>
            <div class="quiz-feedback hidden text-sm p-4 rounded-xl"></div>
          </div>
        `).join('')}
      </div>
    </div>

  </main>

  <!-- Footer -->
  <footer class="mt-16 border-t border-slate-800 bg-slate-900 py-8 text-center text-xs text-slate-500">
    <p>Generated by StudyForge AI • Multi-Agent Gemini Learning Engine</p>
    <p class="mt-1">Self-contained offline interactive eBook format.</p>
  </footer>

  <!-- Script for Interactivity and Math Rendering -->
  <script>
    const ebookData = ${jsonString};

    function renderMath() {
      if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
        window.MathJax.typesetPromise();
      } else if (typeof renderMathInElement === 'function') {
        renderMathInElement(document.body, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\(', right: '\\)', display: false},
            {left: '\\[', right: '\\]', display: true}
          ],
          throwOnError : false
        });
      }
    }

    document.addEventListener("DOMContentLoaded", function() {
      renderMath();
    });

    function switchTab(tabName) {
      ['chapters', 'flashcards', 'glossary', 'quiz'].forEach(t => {
        const content = document.getElementById('tab-content-' + t);
        const btn = document.getElementById('tab-btn-' + t);
        if (t === tabName) {
          content.classList.remove('hidden');
          btn.className = 'px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 text-white shadow';
        } else {
          content.classList.add('hidden');
          btn.className = 'px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 hover:text-white';
        }
      });
    }

    function toggleChapterNav(chIdx) {
      const el = document.getElementById('chap-nav-list-' + chIdx);
      if (el) el.classList.toggle('hidden');
    }

    function checkQuizAnswer(containerId, selectedIdx, correctIdx, explanation) {
      const container = document.getElementById(containerId);
      if (!container) return;
      const feedback = container.querySelector('.quiz-feedback');
      if (!feedback) return;

      feedback.classList.remove('hidden');
      if (selectedIdx === correctIdx) {
        feedback.className = 'quiz-feedback text-xs p-3 rounded-lg mt-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300';
        feedback.innerHTML = '<strong>✓ Correct!</strong> ' + explanation;
      } else {
        feedback.className = 'quiz-feedback text-xs p-3 rounded-lg mt-2 bg-rose-950/80 border border-rose-500/40 text-rose-300';
        feedback.innerHTML = '<strong>✗ Not quite right.</strong> ' + explanation;
      }
      renderMath();
    }
  </script>
</body>
</html>`;
}

