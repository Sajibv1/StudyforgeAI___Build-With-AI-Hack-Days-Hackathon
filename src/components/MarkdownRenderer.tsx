import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MarkdownRendererProps {
  content: string | undefined | null;
  className?: string;
  inline?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
  inline = false,
}) => {
  if (!content) return null;

  // Pre-process text to convert LaTeX delimiters if needed
  const normalizedContent = String(content)
    .replace(/\\\((.*?)\\\)/gs, '$$1$')
    .replace(/\\\[(.*?)\\\]/gs, '$$$$1$$$$');

  if (inline) {
    return (
      <span className={`inline-markdown ${className}`}>
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            p: ({ children }) => <span>{children}</span>,
            code: ({ children }) => (
              <code className="bg-slate-100 text-indigo-700 font-mono text-[0.9em] px-1 py-0.5 rounded">
                {children}
              </code>
            ),
          }}
        >
          {normalizedContent}
        </ReactMarkdown>
      </span>
    );
  }

  return (
    <div className={`prose max-w-none text-slate-800 leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => <h1 className="text-xl font-bold text-slate-900 mt-6 mb-3">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold text-slate-900 mt-5 mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-bold text-slate-800 mt-4 mb-2">{children}</h3>,
          p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="mb-0.5">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-indigo-500 pl-4 py-1.5 my-4 bg-indigo-50/50 rounded-r-lg text-slate-700 italic text-sm">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium">
              {children}
            </a>
          ),
          code({ className, children, ...props }) {
            const isCodeBlock = className && className.includes('language-');
            if (isCodeBlock) {
              return (
                <div className="my-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 text-slate-100 p-4 font-mono text-xs overflow-x-auto">
                  <code {...props}>{children}</code>
                </div>
              );
            }
            return (
              <code className="bg-slate-100 text-indigo-700 font-mono text-[0.88em] px-1.5 py-0.5 rounded border border-slate-200" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
};
