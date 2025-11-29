import { Suspense } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading content...</div>}>
      <div className={`prose prose-slate prose-lg max-w-none ${className}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          components={{
            // Customize heading styling
            h1: ({ node, ...props }) => (
              <h1 className="text-hero font-bold text-slate-900 mb-6" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-h2 font-bold text-slate-900 mb-4 mt-8" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-6" {...props} />
            ),
            h4: ({ node, ...props }) => (
              <h4 className="text-xl font-bold text-slate-900 mb-3" {...props} />
            ),
            // Customize link styling
            a: ({ node, ...props }) => (
              <a className="text-blue-600 hover:text-blue-700 underline" {...props} />
            ),
            // Customize paragraph styling
            p: ({ node, ...props }) => (
              <p className="text-slate-700 mb-4" {...props} />
            ),
            // Customize list styling
            ul: ({ node, ...props }) => (
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal pl-6 text-slate-700 space-y-2 mb-4" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="text-slate-700" {...props} />
            ),
            // Customize code styling
            code: ({ node, className, children, ...props }) => {
              const inline = !className
              return inline ? (
                <code className="bg-slate-100 px-2 py-1 rounded text-sm" {...props}>
                  {children}
                </code>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },
            // Customize blockquote styling
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-600 my-4" {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </Suspense>
  )
}
