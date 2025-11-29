import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, CheckCircle, Clock } from 'lucide-react'
import { loadCourseMetadata, getNextChapter, getPreviousChapter, getChapterNumber } from '../lib/courseUtils'
import ChapterRenderer from '../components/ChapterRenderer'

// Import all chapter markdown files
const chapters: Record<string, any> = {
  'understanding-threat-landscape': () => import('../../content/courses/individuals/understanding-threat-landscape.md?raw'),
  'email-phishing-scams': () => import('../../content/courses/individuals/email-phishing-scams.md?raw'),
  'smishing-text-scams': () => import('../../content/courses/individuals/smishing-text-scams.md?raw'),
  'social-media-scams': () => import('../../content/courses/individuals/social-media-scams.md?raw'),
  'banking-financial-scams': () => import('../../content/courses/individuals/banking-financial-scams.md?raw'),
  'package-delivery-scams': () => import('../../content/courses/individuals/package-delivery-scams.md?raw'),
  'romance-scams': () => import('../../content/courses/individuals/romance-scams.md?raw'),
  'tax-irs-scams': () => import('../../content/courses/individuals/tax-irs-scams.md?raw'),
  'cryptocurrency-investment-scams': () => import('../../content/courses/individuals/cryptocurrency-investment-scams.md?raw'),
  'online-shopping-ecommerce-scams': () => import('../../content/courses/individuals/online-shopping-ecommerce-scams.md?raw'),
  'psychological-manipulation': () => import('../../content/courses/individuals/psychological-manipulation.md?raw'),
  'what-to-do-if-compromised': () => import('../../content/courses/individuals/what-to-do-if-compromised.md?raw'),
}

export const Route = createFileRoute('/learn/individuals/$chapterSlug')({
  loader: async ({ params }) => {
    const chapterLoader = chapters[params.chapterSlug]

    if (!chapterLoader) {
      throw notFound()
    }

    // Dynamically import the markdown content
    const { default: rawContent } = await chapterLoader()

    // Parse frontmatter manually (simple parser)
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
    const match = rawContent.match(frontmatterRegex)

    let metadata: any = {}
    let content = rawContent

    if (match) {
      // Parse YAML-like frontmatter
      const frontmatter = match[1]
      content = match[2]

      // Simple YAML parser for our needs
      const lines = frontmatter.split('\n')
      for (const line of lines) {
        if (line.includes(':')) {
          const [key, ...valueParts] = line.split(':')
          const value = valueParts.join(':').trim()

          // Handle arrays
          if (key.trim() === 'learningObjectives') {
            metadata.learningObjectives = []
          } else if (line.startsWith('  - ')) {
            const objective = line.substring(4).trim()
            if (metadata.learningObjectives) {
              metadata.learningObjectives.push(objective)
            }
          } else {
            metadata[key.trim()] = value
          }
        }
      }
    }

    const courseMetadata = loadCourseMetadata('individuals')
    const chapterNumber = getChapterNumber('individuals', params.chapterSlug)
    const chapterInfo = courseMetadata.chapters.find((ch) => ch.slug === params.chapterSlug)
    const nextChapter = getNextChapter('individuals', params.chapterSlug)
    const previousChapter = getPreviousChapter('individuals', params.chapterSlug)

    return {
      chapter: {
        metadata,
        content,
        slug: params.chapterSlug,
        courseId: 'individuals' as const,
      },
      metadata: courseMetadata,
      chapterNumber,
      chapterInfo,
      nextChapter,
      previousChapter,
    }
  },
  component: ChapterPage,
})

function ChapterPage() {
  const { chapter, metadata, chapterNumber, chapterInfo, nextChapter, previousChapter } =
    Route.useLoaderData()

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link to="/learn" className="hover:text-blue-600">
            Learn
          </Link>
          <span>/</span>
          <Link to="/learn/individuals" className="hover:text-blue-600">
            Individuals Course
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Chapter {chapterNumber}</span>
        </div>

        {/* Chapter Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
              Chapter {chapterNumber} of {metadata.chapters.length}
            </div>
            {chapterInfo?.duration && (
              <div className="flex items-center gap-1 text-gray-600 text-sm">
                <Clock className="w-4 h-4" />
                <span>{chapterInfo.duration}</span>
              </div>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {chapter.metadata.title || chapterInfo?.title}
          </h1>
          {chapter.metadata.learningObjectives && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <h2 className="font-bold text-gray-900 mb-3">Learning Objectives:</h2>
              <ul className="space-y-2">
                {chapter.metadata.learningObjectives.map((objective: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Chapter Content */}
        <article className="mb-16">
          <ChapterRenderer content={chapter.content} />
        </article>

        {/* Navigation */}
        <div className="border-t-2 border-gray-200 pt-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {/* Previous Chapter */}
            <div className="flex-1">
              {previousChapter ? (
                <Link
                  to="/learn/individuals/$chapterSlug"
                  params={{ chapterSlug: previousChapter }}
                  className="group flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                  <div className="text-left">
                    <div className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
                      Previous Chapter
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {metadata.chapters.find((ch) => ch.slug === previousChapter)?.title}
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="p-4 rounded-lg border-2 border-gray-100 bg-gray-50">
                  <div className="text-sm text-gray-400">This is the first chapter</div>
                </div>
              )}
            </div>

            {/* Next Chapter */}
            <div className="flex-1">
              {nextChapter ? (
                <Link
                  to="/learn/individuals/$chapterSlug"
                  params={{ chapterSlug: nextChapter }}
                  className="group flex items-center justify-end gap-3 p-4 rounded-lg border-2 border-blue-500 bg-blue-50 hover:bg-blue-100 transition-all"
                >
                  <div className="text-right">
                    <div className="text-sm text-blue-600 font-medium">Next Chapter</div>
                    <div className="text-gray-900 font-semibold">
                      {metadata.chapters.find((ch) => ch.slug === nextChapter)?.title}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                </Link>
              ) : (
                <Link
                  to="/learn/individuals"
                  className="group flex items-center justify-end gap-3 p-4 rounded-lg border-2 border-green-500 bg-green-50 hover:bg-green-100 transition-all"
                >
                  <div className="text-right">
                    <div className="text-sm text-green-600 font-medium">Course Complete!</div>
                    <div className="text-gray-900 font-semibold">Back to Course Hub</div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Back to Course Hub */}
        <div className="mt-8 text-center">
          <Link
            to="/learn/individuals"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Course Hub
          </Link>
        </div>
      </div>
    </div>
  )
}
