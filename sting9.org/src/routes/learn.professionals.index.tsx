import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Clock, Target, BookOpen, CheckCircle2 } from 'lucide-react'
import { loadCourseMetadata } from '../lib/courseUtils'

export const Route = createFileRoute('/learn/professionals/')({
  loader: () => {
    const metadata = loadCourseMetadata('professionals')
    return { metadata }
  },
  component: ProfessionalsCourseHub,
})

function ProfessionalsCourseHub() {
  const { metadata } = Route.useLoaderData()
  const { title, subtitle, description, duration, chapters } = metadata

  return (
    <div className="min-h-screen bg-linear-to-b from-purple-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link
          to="/learn"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>

        {/* Course Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <div className="text-6xl mb-6">💼</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-2xl text-gray-600 mb-6">{subtitle}</p>
          <p className="text-lg text-gray-700 mb-8">{description}</p>

          {/* Course Stats */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5 text-purple-500" />
              <span className="font-medium">{duration}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <BookOpen className="w-5 h-5 text-purple-500" />
              <span className="font-medium">{chapters.length} Chapters</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Target className="w-5 h-5 text-purple-500" />
              <span className="font-medium">Intermediate Level</span>
            </div>
          </div>
        </div>

        {/* Chapters List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Chapters</h2>
          {chapters.map((chapter) => (
            <Link
              key={chapter.number}
              to="/learn/professionals/$chapterSlug"
              params={{ chapterSlug: chapter.slug }}
              className="block bg-white rounded-xl shadow hover:shadow-lg transition-all duration-200 p-6 group border-2 border-transparent hover:border-purple-500"
            >
              <div className="flex items-start gap-4">
                {/* Chapter Number */}
                <div className="shrink-0 w-12 h-12 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-lg">{chapter.number}</span>
                </div>

                {/* Chapter Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                    {chapter.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{chapter.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{chapter.duration}</span>
                  </div>
                </div>

                {/* Completion Indicator (placeholder for now) */}
                <div className="shrink-0 hidden md:block">
                  <CheckCircle2 className="w-6 h-6 text-gray-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Start Button */}
        <div className="mt-12 text-center">
          <Link
            to="/learn/professionals/$chapterSlug"
            params={{ chapterSlug: chapters[0].slug }}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
          >
            Start Course
            <span className="text-2xl">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
