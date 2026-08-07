import React, { useState } from 'react';
import { GenerationConfig, GenerationMode } from '../types';
import { Sparkles, Rocket, Users, Target, HelpCircle, Check, Sliders, Palette, Zap, X } from 'lucide-react';

interface GenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (config: GenerationConfig) => void;
  isGenerating: boolean;
}

export const GenerationModal: React.FC<GenerationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isGenerating,
}) => {
  const [mode, setMode] = useState<GenerationMode>('auto');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');

  // Semi Auto Pilot Questions
  const [targetAudience, setTargetAudience] = useState('Beginners & Enthusiasts');
  const [length, setLength] = useState<'short' | 'medium' | 'comprehensive'>('medium');
  const [includeQuizzes, setIncludeQuizzes] = useState(true);
  const [animationLevel, setAnimationLevel] = useState<'subtle' | 'moderate' | 'rich'>('rich');
  const [colorTheme, setColorTheme] = useState('cyberpunk');

  // Prompting Mode Parameters
  const [teachingStyle, setTeachingStyle] = useState('Intuitive & Analogies');
  const [visualStyle, setVisualStyle] = useState('Modern Vector & Infographic');
  const [depth, setDepth] = useState('Intermediate');
  const [quizTypes, setQuizTypes] = useState('Multiple Choice & Conceptual Checkpoints');
  const [language, setLanguage] = useState('English');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const config: GenerationConfig = {
      topic: topic.trim(),
      description: description.trim(),
      mode,
      answers: mode === 'semi' ? {
        targetAudience,
        length,
        includeQuizzes,
        animationLevel,
        colorTheme
      } : undefined,
      promptingParams: mode === 'prompting' ? {
        teachingStyle,
        visualStyle,
        colorPalette: colorTheme,
        animationLevel,
        depth,
        quizTypes,
        language
      } : undefined
    };

    onSubmit(config);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-white border border-slate-200/60 rounded-[24px] w-full max-w-2xl overflow-hidden shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>StudyForge AI</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create Interactive Ebook</h2>
            <p className="text-sm text-slate-500 mt-1 max-w-md">
              Select your preferred generation mode and customize topic parameters for the AI pipeline.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          {/* Mode Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setMode('auto')}
              className={`flex items-center justify-center space-x-2 py-3 px-3 rounded-[12px] text-sm font-semibold transition-all duration-200 ${
                mode === 'auto'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
              }`}
            >
              <Rocket className={`w-4 h-4 ${mode === 'auto' ? 'text-indigo-500' : ''}`} />
              <span>Auto Pilot</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('semi')}
              className={`flex items-center justify-center space-x-2 py-3 px-3 rounded-[12px] text-sm font-semibold transition-all duration-200 ${
                mode === 'semi'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
              }`}
            >
              <Users className={`w-4 h-4 ${mode === 'semi' ? 'text-emerald-500' : ''}`} />
              <span>Semi Auto</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('prompting')}
              className={`flex items-center justify-center space-x-2 py-3 px-3 rounded-[12px] text-sm font-semibold transition-all duration-200 ${
                mode === 'prompting'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
              }`}
            >
              <Target className={`w-4 h-4 ${mode === 'prompting' ? 'text-amber-500' : ''}`} />
              <span>Prompting</span>
            </button>
          </div>

          {/* Topic & Description (Common across all modes) */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">
                Topic / Subject <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Quantum Computing for Beginners, Neural Networks..."
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">
                Specific Goals (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Briefly describe what key concepts should be highlighted..."
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm resize-none"
              />
            </div>
          </div>

          {/* Semi Auto Pilot Questions */}
          {mode === 'semi' && (
            <div className="p-5 bg-slate-50 border border-slate-100 rounded-[16px] space-y-5">
              <div className="flex items-center space-x-2 text-slate-900 font-bold border-b border-slate-200 pb-3">
                <HelpCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm">Semi Auto Parameters</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-1.5">Target Audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  >
                    <option value="Beginners & Enthusiasts">Beginners & Enthusiasts</option>
                    <option value="High School & College Students">High School & College Students</option>
                    <option value="Software Engineers & Data Scientists">Software Engineers & Data Scientists</option>
                    <option value="Kids & Young Learners (12+)">Kids & Young Learners (12+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-1.5">Color Theme</label>
                  <select
                    value={colorTheme}
                    onChange={(e) => setColorTheme(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  >
                    <option value="cyberpunk">Cyberpunk Neon</option>
                    <option value="nordic">Nordic Clean Light</option>
                    <option value="dark_mode">Dark Mode</option>
                    <option value="emerald">Emerald Academic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-1.5">Animation Level</label>
                  <div className="flex gap-2">
                    {(['subtle', 'moderate', 'rich'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setAnimationLevel(lvl)}
                        className={`flex-1 py-2 rounded-lg text-[13px] font-semibold border transition-colors ${
                          animationLevel === lvl
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-1.5">Interactive Quizzes</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIncludeQuizzes(true)}
                      className={`flex-1 py-2 rounded-lg text-[13px] font-semibold border transition-colors ${
                        includeQuizzes ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Include
                    </button>
                    <button
                      type="button"
                      onClick={() => setIncludeQuizzes(false)}
                      className={`flex-1 py-2 rounded-lg text-[13px] font-semibold border transition-colors ${
                        !includeQuizzes ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Exclude
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Prompting Mode Fine-Grained Controls */}
          {mode === 'prompting' && (
            <div className="p-5 bg-slate-50 border border-slate-100 rounded-[16px] space-y-5">
              <div className="flex items-center space-x-2 text-slate-900 font-bold border-b border-slate-200 pb-3">
                <Sliders className="w-4 h-4 text-amber-500" />
                <span className="text-sm">Advanced Prompting Parameters</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-1.5">Teaching Style</label>
                  <input
                    type="text"
                    value={teachingStyle}
                    onChange={(e) => setTeachingStyle(e.target.value)}
                    placeholder="e.g. Intuitive Analogies, Mathematical Rigor"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-1.5">Depth Level</label>
                  <select
                    value={depth}
                    onChange={(e) => setDepth(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  >
                    <option value="Introductory">Introductory</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Comprehensive Masterclass">Comprehensive Masterclass</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-1.5">Visual Diagrams Style</label>
                  <input
                    type="text"
                    value={visualStyle}
                    onChange={(e) => setVisualStyle(e.target.value)}
                    placeholder="e.g. Flowcharts, Timelines, Vector Infographics"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-1.5">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="French">French (Français)</option>
                    <option value="German">German (Deutsch)</option>
                    <option value="Japanese">Japanese (日本語)</option>
                    <option value="Chinese">Chinese (中文)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-[12px] text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating || !topic.trim()}
              className="px-6 py-2.5 rounded-[12px] text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Generate Ebook</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
