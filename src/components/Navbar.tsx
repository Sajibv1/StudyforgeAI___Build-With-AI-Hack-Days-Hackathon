import React from 'react';
import { BookOpen, Sparkles, Download, Plus, Moon, Sun, Cpu, CheckCircle2, RefreshCw } from 'lucide-react';
import { EbookData } from '../types';
import { generateSelfContainedHtml } from '../utils/htmlExporter';

interface NavbarProps {
  currentEbook: EbookData | null;
  onNewEbook: () => void;
  onSelectSample: () => void;
  isGenerating: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentEbook,
  onNewEbook,
  onSelectSample,
  isGenerating
}) => {
  const handleExportHtml = () => {
    if (!currentEbook) return;
    const htmlString = generateSelfContainedHtml(currentEbook);
    const blob = new Blob([htmlString], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentEbook.topic.toLowerCase().replace(/[^a-z0-0]+/g, '-')}-ebook.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onSelectSample}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
            S
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                StudyForge <span className="text-indigo-600 font-semibold">AI</span>
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                Multi-Agent
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block font-medium">Interactive Learning Materials & Ebook Engine</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onSelectSample}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Preset Ebooks</span>
          </button>

          {currentEbook && (
            <button
              onClick={handleExportHtml}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Export HTML</span>
              <span className="sm:hidden">Export</span>
            </button>
          )}

          <button
            onClick={onNewEbook}
            disabled={isGenerating}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{isGenerating ? 'Forging...' : 'New Ebook'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
