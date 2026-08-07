import React, { useState, useMemo } from 'react';
import { EbookData } from '../types';
import { generateSelfContainedHtml } from '../utils/htmlExporter';
import {
  Monitor,
  Tablet,
  Smartphone,
  Download,
  ExternalLink,
  Copy,
  Check,
  Code,
  Eye,
  RefreshCw,
  Sparkles,
  Send,
  FileText
} from 'lucide-react';

interface EbookViewerProps {
  ebook: EbookData;
  onIterate: (instruction: string, chapterId?: string, sectionId?: string) => void;
  isIterating: boolean;
}

export const EbookViewer: React.FC<EbookViewerProps> = ({
  ebook,
  onIterate,
  isIterating,
}) => {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [iterationPrompt, setIterationPrompt] = useState('');
  const [iframeKey, setIframeKey] = useState(0);

  // Generate self-contained HTML
  const htmlContent = useMemo(() => {
    return generateSelfContainedHtml(ebook);
  }, [ebook]);

  // Handle Blob URL for "Open in New Tab"
  const handleOpenNewTab = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // Handle HTML Download
  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ebook.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-ebook.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle Copy HTML Code
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Handle AI Iteration Submit
  const handleIterationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!iterationPrompt.trim() || isIterating) return;
    onIterate(iterationPrompt);
    setIterationPrompt('');
  };

  // Viewport Container Dimensions
  const viewportWidthClass = {
    desktop: 'w-full max-w-full',
    tablet: 'w-[768px] max-w-full mx-auto',
    mobile: 'w-[375px] max-w-full mx-auto',
  }[viewportSize];

  return (
    <div className="space-y-6">
      
      {/* Top Header & Toolbar Controls */}
      <div className="bg-white border border-slate-200/60 shadow-sm rounded-[24px] p-5 sm:p-6 space-y-5">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          {/* Title and Metadata info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                HTML Live Previewer
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {ebook.chapters?.length || 0} Chapters • {ebook.flashcards?.length || 0} Flashcards
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
              {ebook.topic}
            </h1>
            <p className="text-sm text-slate-500 line-clamp-1 mt-1">
              {ebook.subtitle || ebook.description}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* View Mode Toggle (Preview vs Raw Code) */}
            <div className="flex items-center bg-slate-50 p-1.5 rounded-[12px] border border-slate-200/60 text-xs font-semibold">
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'preview'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'code'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Code className="w-4 h-4" />
                <span>Source Code</span>
              </button>
            </div>

            {/* Viewport Sizing (Desktop/Tablet/Mobile) */}
            {viewMode === 'preview' && (
              <div className="hidden sm:flex items-center bg-slate-50 p-1.5 rounded-[12px] border border-slate-200/60 text-xs">
                <button
                  onClick={() => setViewportSize('desktop')}
                  title="Desktop View"
                  className={`p-2 rounded-lg transition-all ${
                    viewportSize === 'desktop'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewportSize('tablet')}
                  title="Tablet View (768px)"
                  className={`p-2 rounded-lg transition-all ${
                    viewportSize === 'tablet'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewportSize('mobile')}
                  title="Mobile View (375px)"
                  className={`p-2 rounded-lg transition-all ${
                    viewportSize === 'mobile'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Refresh Frame Button */}
            {viewMode === 'preview' && (
              <button
                onClick={() => setIframeKey((prev) => prev + 1)}
                title="Reload HTML Frame"
                className="p-2.5 rounded-[12px] border border-slate-200/60 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {/* Copy HTML Button */}
            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-[12px] border border-slate-200/60 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {/* Open in New Tab Button */}
            <button
              onClick={handleOpenNewTab}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-[12px] border border-slate-200/60 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors shadow-sm"
            >
              <ExternalLink className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Open</span>
            </button>

            {/* Download Standalone HTML Button */}
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-[12px] bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export HTML</span>
            </button>

          </div>

        </div>

      </div>

      {/* Main HTML Preview Stage or Source Code View */}
      <div className="transition-all duration-300">
        {viewMode === 'preview' ? (
          <div className="bg-slate-100 p-2 sm:p-6 rounded-[24px] border border-slate-200/60 shadow-inner min-h-[750px] flex flex-col items-center justify-start">
            
            {/* Device Frame Window */}
            <div className={`transition-all duration-300 ${viewportWidthClass} bg-slate-900 rounded-[16px] overflow-hidden shadow-2xl border border-slate-800 flex flex-col`}>
              
              {/* Fake Window Header */}
              <div className="bg-[#0A0A0A] px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-slate-700/80"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-700/80"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-700/80"></div>
                </div>
                <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1 rounded-md text-[11px] font-mono text-slate-400 border border-slate-800 max-w-xs truncate">
                  <FileText className="w-3 h-3 text-indigo-400 shrink-0" />
                  <span className="truncate">{ebook.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-ebook.html</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 font-semibold hidden sm:block">
                  Stand-Alone File
                </div>
              </div>

              {/* Iframe Preview Container */}
              <div className="relative w-full bg-slate-950">
                <iframe
                  key={iframeKey}
                  title="HTML Ebook Preview"
                  srcDoc={htmlContent}
                  className="w-full h-[750px] border-0 bg-slate-950"
                  sandbox="allow-scripts allow-modals allow-same-origin"
                />
              </div>

            </div>

          </div>
        ) : (
          /* Raw HTML Source Code View */
          <div className="bg-[#0A0A0A] border border-slate-800 rounded-[24px] overflow-hidden shadow-xl">
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-2 font-mono text-indigo-400">
                <Code className="w-4 h-4" />
                <span>Generated HTML Code ({htmlContent.length.toLocaleString()} bytes)</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-1 text-xs text-slate-300 hover:text-white"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 sm:p-6 text-xs text-slate-300 font-mono overflow-x-auto max-h-[750px] leading-relaxed select-text bg-[#0A0A0A]">
              <code>{htmlContent}</code>
            </pre>
          </div>
        )}
      </div>

      {/* AI Refinement & Iteration Bar */}
      <div className="bg-white border border-slate-200/60 shadow-sm rounded-[24px] p-5 sm:p-6">
        <form onSubmit={handleIterationSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Refine with AI Agents</span>
            </label>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Ask AI agents to add sections, adjust tone, or update quizzes
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={iterationPrompt}
              onChange={(e) => setIterationPrompt(e.target.value)}
              placeholder="e.g., 'Add 2 more flashcards about formulas', 'Explain chapter 2 with simpler language'..."
              disabled={isIterating}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isIterating || !iterationPrompt.trim()}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-sm transition-colors flex items-center space-x-2 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>{isIterating ? 'Iterating...' : 'Update Ebook'}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
