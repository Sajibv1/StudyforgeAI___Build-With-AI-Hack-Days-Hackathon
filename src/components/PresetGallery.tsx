import React from 'react';
import { SAMPLE_EBOOKS } from '../data/sampleEbooks';
import { EbookData } from '../types';
import { Sparkles, BookOpen, Clock, Layers, ArrowRight, Zap } from 'lucide-react';

interface PresetGalleryProps {
  onSelectEbook: (ebook: EbookData) => void;
  onOpenGenerator: () => void;
}

export const PresetGallery: React.FC<PresetGalleryProps> = ({
  onSelectEbook,
  onOpenGenerator,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider shadow-sm">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Multi-Agent AI Learning Engine</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          From Any Topic to <br className="hidden sm:block" />
          <span className="text-indigo-600 relative">
            Stunning Interactive Ebooks
            <span className="absolute bottom-1 left-0 w-full h-3 bg-indigo-100 -z-10 rounded-sm"></span>
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
          StudyForge AI leverages a multi-agent team (Orchestrator, Research, Education, Visualization, Designer, Reviewer) to transform raw prompts into publication-quality HTML learning materials.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenGenerator}
            className="px-8 py-4 rounded-[16px] text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <Zap className="w-4 h-4 fill-white text-white" />
            <span>Forge New Ebook</span>
          </button>
        </div>
      </div>

      {/* Preset Ebooks Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/60 pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Preset Interactive Ebooks</h2>
            <p className="text-sm text-slate-500 mt-1">Click any preset to open the full interactive reader instantly.</p>
          </div>
          <span className="text-xs text-indigo-600 font-mono font-semibold px-2.5 py-1 bg-indigo-50 rounded-md border border-indigo-100">
            2 Ready Samples
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {SAMPLE_EBOOKS.map((ebook) => (
            <div
              key={ebook.id}
              onClick={() => onSelectEbook(ebook)}
              className="group bg-white border border-slate-200/60 hover:border-indigo-300 rounded-[24px] p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              {/* Card Accent Glow */}
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-indigo-50 rounded-full blur-3xl group-hover:bg-indigo-100/50 transition-all pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                    {ebook.mode.toUpperCase()} MODE
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1.5 font-mono font-semibold bg-slate-50 px-2 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5" /> ~{ebook.metadata.totalReadTime} mins
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {ebook.topic}
                </h3>
                <p className="text-sm font-semibold text-indigo-600 mb-4">{ebook.subtitle}</p>
                <p className="text-sm text-slate-600 leading-relaxed mb-8 line-clamp-3">
                  {ebook.description}
                </p>
              </div>

              <div className="pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 relative z-10">
                <div className="flex items-center space-x-4 font-mono font-medium">
                  <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-indigo-500" />{ebook.chapters.length} Chaps</span>
                  <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-emerald-500" />{ebook.flashcards.length} Cards</span>
                </div>

                <span className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                  Read Ebook <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
