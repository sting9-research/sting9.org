import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, CheckCircle, Clock } from 'lucide-react'
import { loadCourseMetadata, getNextChapter, getPreviousChapter, getChapterNumber } from '../lib/courseUtils'
import ChapterRenderer from '../components/ChapterRenderer'

// Import all chapter markdown files
const chapters: Record<string, any> = {
  'bec-landscape': () => import('../../content/courses/professionals/bec-landscape.md?raw'),
  'ceo-fraud-whaling': () => import('../../content/courses/professionals/ceo-fraud-whaling.md?raw'),
  'wire-transfer-invoice-fraud': () => import('../../content/courses/professionals/wire-transfer-invoice-fraud.md?raw'),
  'vendor-email-compromise': () => import('../../content/courses/professionals/vendor-email-compromise.md?raw'),
  'payroll-diversion-scams': () => import('../../content/courses/professionals/payroll-diversion-scams.md?raw'),
  'm365-google-workspace-attacks': () => import('../../content/courses/professionals/m365-google-workspace-attacks.md?raw'),
  'supply-chain-third-party-risks': () => import('../../content/courses/professionals/supply-chain-third-party-risks.md?raw'),
  'advanced-persistent-threats': () => import('../../content/courses/professionals/advanced-persistent-threats.md?raw'),
  'deepfakes-ai-enhanced-attacks': () => import('../../content/courses/professionals/deepfakes-ai-enhanced-attacks.md?raw'),
  'incident-response-policies': () => import('../../content/courses/professionals/incident-response-policies.md?raw'),
  'security-awareness-training': () => import('../../content/courses/professionals/security-awareness-training.md?raw'),
  'building-security-culture': () => import('../../content/courses/professionals/building-security-culture.md?raw'),
}

export const Route = createFileRoute('/learn/professionals/$chapterSlug')({
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

    const courseMetadata = loadCourseMetadata('professionals')
    const chapterNumber = getChapterNumber('professionals', params.chapterSlug)
    const chapterInfo = courseMetadata.chapters.find((ch) => ch.slug === params.chapterSlug)
    const nextChapter = getNextChapter('professionals', params.chapterSlug)
    const previousChapter = getPreviousChapter('professionals', params.chapterSlug)

    return {
      chapter: {
        metadata,
        content,
        slug: params.chapterSlug,
        courseId: 'professionals' as const,
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
          <Link to="/learn" className="hover:text-purple-600">
            Learn
          </Link>
          <span>/</span>
          <Link to="/learn/professionals" className="hover:text-purple-600">
            Professionals Course
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Chapter {chapterNumber}</span>
        </div>

        {/* Chapter Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
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
            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
              <h2 className="font-bold text-gray-900 mb-3">Learning Objectives:</h2>
              <ul className="space-y-2">
                {chapter.metadata.learningObjectives.map((objective: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
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
                  to="/learn/professionals/$chapterSlug"
                  params={{ chapterSlug: previousChapter }}
                  className="group flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                  <div className="text-left">
                    <div className="text-sm text-gray-600 group-hover:text-purple-600 font-medium">
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
                  to="/learn/professionals/$chapterSlug"
                  params={{ chapterSlug: nextChapter }}
                  className="group flex items-center justify-end gap-3 p-4 rounded-lg border-2 border-purple-500 bg-purple-50 hover:bg-purple-100 transition-all"
                >
                  <div className="text-right">
                    <div className="text-sm text-purple-600 font-medium">Next Chapter</div>
                    <div className="text-gray-900 font-semibold">
                      {metadata.chapters.find((ch) => ch.slug === nextChapter)?.title}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-purple-600" />
                </Link>
              ) : (
                <Link
                  to="/learn/professionals"
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
            to="/learn/professionals"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Course Hub
          </Link>
        </div>
      </div>
    </div>
  )
}
