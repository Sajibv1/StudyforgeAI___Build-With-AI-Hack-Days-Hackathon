import React, { useState } from 'react';
import { EbookData, AgentStep, GenerationConfig } from './types';
import { SAMPLE_EBOOKS } from './data/sampleEbooks';
import { Navbar } from './components/Navbar';
import { MultiAgentShowcase } from './components/MultiAgentShowcase';
import { GenerationModal } from './components/GenerationModal';
import { EbookViewer } from './components/EbookViewer';
import { PresetGallery } from './components/PresetGallery';

export default function App() {
  const [currentEbook, setCurrentEbook] = useState<EbookData | null>(SAMPLE_EBOOKS[0]);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isIterating, setIsIterating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'reader' | 'gallery'>('reader');

  // Handle New Ebook Generation via Stream
  const handleGenerateEbook = async (config: GenerationConfig) => {
    setIsGenerating(true);
    setAgentSteps([]);
    setIsModalOpen(false);

    try {
      const response = await fetch('/api/generate-ebook-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!response.body) throw new Error('ReadableStream not supported');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const block of lines) {
          const eventMatch = block.match(/^event:\s*(.+)$/m);
          const dataMatch = block.match(/^data:\s*(.+)$/m);

          if (eventMatch && dataMatch) {
            const event = eventMatch[1].trim();
            const data = JSON.parse(dataMatch[1].trim());

            if (event === 'agent_step') {
              setAgentSteps((prev) => {
                // When receiving a 'completed' step for an agent, mark any previous 'working' step for that agent as 'completed'
                const updated = prev.map((s) => {
                  if (s.agent === data.agent && s.status === 'working' && data.status === 'completed') {
                    return { ...s, status: 'completed' as const };
                  }
                  return s;
                });

                const existingIdx = updated.findIndex((s) => s.agent === data.agent && s.title === data.title);
                if (existingIdx >= 0) {
                  updated[existingIdx] = { ...updated[existingIdx], ...data, id: updated[existingIdx].id };
                  return updated;
                }
                return [...updated, { ...data, id: `step-${Date.now()}-${Math.random()}` }];
              });
            } else if (event === 'complete') {
              setAgentSteps((prev) =>
                prev.map((s) => ({ ...s, status: 'completed' as const }))
              );
              setCurrentEbook(data);
              setViewMode('reader');
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Section Iteration
  const handleIterateEbook = async (instruction: string, targetChapterId?: string, targetSectionId?: string) => {
    if (!currentEbook) return;
    setIsIterating(true);

    try {
      const response = await fetch('/api/iterate-ebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ebookData: currentEbook,
          instruction,
          targetChapterId,
          targetSectionId,
        }),
      });

      const data = await response.json();
      if (data.success && data.ebook) {
        setCurrentEbook(data.ebook);
      }
    } catch (err) {
      console.error('Iteration error:', err);
    } finally {
      setIsIterating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation Header */}
      <Navbar
        currentEbook={currentEbook}
        onNewEbook={() => setIsModalOpen(true)}
        onSelectSample={() => setViewMode(viewMode === 'gallery' ? 'reader' : 'gallery')}
        isGenerating={isGenerating}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        
        {/* Multi-Agent Showcase Panel (Active during generation or when steps exist) */}
        {(isGenerating || agentSteps.length > 0) && (
          <MultiAgentShowcase steps={agentSteps} isGenerating={isGenerating} />
        )}

        {/* View Switching */}
        {viewMode === 'gallery' ? (
          <PresetGallery
            onSelectEbook={(ebook) => {
              setCurrentEbook(ebook);
              setViewMode('reader');
            }}
            onOpenGenerator={() => setIsModalOpen(true)}
          />
        ) : (
          currentEbook && (
            <EbookViewer
              ebook={currentEbook}
              onIterate={handleIterateEbook}
              isIterating={isIterating}
            />
          )
        )}
      </div>

      {/* Generation Modal */}
      <GenerationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleGenerateEbook}
        isGenerating={isGenerating}
      />

    </div>
  );
}
