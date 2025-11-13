import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

interface ChapterRendererProps {
  content: string
}

export default function ChapterRenderer({ content }: ChapterRendererProps) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-strong:font-semibold prose-ul:my-6 prose-li:my-2 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-table:border-collapse prose-th:bg-gray-100 prose-th:p-3 prose-th:text-left prose-td:p-3 prose-td:border-t prose-td:border-gray-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          // Custom styling for specific elements
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl font-bold text-gray-900 mb-6" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 border-b-2 border-gray-200 pb-3" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-xl font-bold text-gray-900 mt-6 mb-3" {...props} />
          ),
          // Highlighted callouts
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-yellow-500 bg-yellow-50 py-4 px-6 my-6 rounded-r-lg" {...props} />
          ),
          // Tables
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-8">
              <table className="min-w-full border-collapse" {...props} />
            </div>
          ),
          // Lists with better spacing
          ul: ({ node, ...props }) => (
            <ul className="my-6 space-y-2 list-disc list-inside" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="my-6 space-y-2 list-decimal list-inside" {...props} />
          ),
          // Code blocks
          pre: ({ node, ...props }) => (
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6" {...props} />
          ),
          code: ({ node, inline, ...props }: any) =>
            inline ? (
              <code className="bg-gray-100 text-gray-900 px-2 py-1 rounded text-sm font-mono" {...props} />
            ) : (
              <code className="font-mono text-sm" {...props} />
            ),
          // Links
          a: ({ node, ...props }) => (
            <a className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
