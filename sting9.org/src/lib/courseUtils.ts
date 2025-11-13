import individualsMetadata from '../../content/courses/individuals/metadata.json'
import professionalsMetadata from '../../content/courses/professionals/metadata.json'

export interface ChapterMetadata {
  title: string
  duration?: string
  learningObjectives?: string[]
  [key: string]: any
}

export interface ChapterData {
  metadata: ChapterMetadata
  content: string
  slug: string
  courseId: string
}

export interface CourseMetadata {
  id: string
  title: string
  subtitle: string
  description: string
  duration: string
  target_audience: string
  icon: string
  difficulty: string
  chapters: Array<{
    number: number
    slug: string
    title: string
    duration: string
    description: string
  }>
}

/**
 * Load course metadata from imported JSON
 */
export function loadCourseMetadata(courseId: 'individuals' | 'professionals'): CourseMetadata {
  if (courseId === 'individuals') {
    return individualsMetadata as CourseMetadata
  }
  return professionalsMetadata as CourseMetadata
}

/**
 * Load chapter - this is now a server-only function
 * Should only be called from route loaders
 */
export async function loadChapter(
  courseId: 'individuals' | 'professionals',
  chapterSlug: string
): Promise<ChapterData | null> {
  // This will be handled by the route loader with server-side imports
  throw new Error('loadChapter should only be called from server-side route loaders')
}

/**
 * Get progress from localStorage (client-side only)
 */
export function getProgress(courseId: string): Set<string> {
  if (typeof window === 'undefined') {
    return new Set()
  }

  const key = `sting9_progress_${courseId}`
  const stored = localStorage.getItem(key)

  if (!stored) {
    return new Set()
  }

  try {
    const parsed = JSON.parse(stored)
    return new Set(parsed)
  } catch {
    return new Set()
  }
}

/**
 * Save progress to localStorage (client-side only)
 */
export function saveProgress(courseId: string, completedChapters: Set<string>): void {
  if (typeof window === 'undefined') {
    return
  }

  const key = `sting9_progress_${courseId}`
  localStorage.setItem(key, JSON.stringify(Array.from(completedChapters)))
}

/**
 * Mark a chapter as completed
 */
export function markChapterComplete(courseId: string, chapterSlug: string): void {
  const progress = getProgress(courseId)
  progress.add(chapterSlug)
  saveProgress(courseId, progress)
}

/**
 * Check if a chapter is completed
 */
export function isChapterComplete(courseId: string, chapterSlug: string): boolean {
  const progress = getProgress(courseId)
  return progress.has(chapterSlug)
}

/**
 * Get next chapter slug
 */
export function getNextChapter(
  courseId: 'individuals' | 'professionals',
  currentSlug: string
): string | null {
  const metadata = loadCourseMetadata(courseId)
  const currentIndex = metadata.chapters.findIndex((ch) => ch.slug === currentSlug)

  if (currentIndex === -1 || currentIndex === metadata.chapters.length - 1) {
    return null
  }

  return metadata.chapters[currentIndex + 1].slug
}

/**
 * Get previous chapter slug
 */
export function getPreviousChapter(
  courseId: 'individuals' | 'professionals',
  currentSlug: string
): string | null {
  const metadata = loadCourseMetadata(courseId)
  const currentIndex = metadata.chapters.findIndex((ch) => ch.slug === currentSlug)

  if (currentIndex <= 0) {
    return null
  }

  return metadata.chapters[currentIndex - 1].slug
}

/**
 * Get chapter number
 */
export function getChapterNumber(
  courseId: 'individuals' | 'professionals',
  chapterSlug: string
): number {
  const metadata = loadCourseMetadata(courseId)
  const chapter = metadata.chapters.find((ch) => ch.slug === chapterSlug)
  return chapter?.number || 0
}
