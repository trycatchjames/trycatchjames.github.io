/// <reference types="vite/client" />

export type AutoIndexSort = 'title' | 'date-desc' | 'date-asc'

export type ContentEntry = {
  path: string
  url: string
  title: string
  date?: string
  excerpt?: string
  tags: string[]
}

export type ContentQuery = {
  pattern: string
  currentPath: string
  recursive?: boolean
  sort?: AutoIndexSort
  limit?: number
}

type Frontmatter = Record<string, unknown>

const markdownFiles = import.meta.glob('../../**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>

export const contentIndex: ContentEntry[] = Object.entries(markdownFiles)
  .map(([importPath, raw]) => buildEntry(importPath, raw))
  .sort((a, b) => a.path.localeCompare(b.path))

export function queryContent(query: ContentQuery): ContentEntry[] {
  const currentPath = normalizePath(query.currentPath)
  const pattern = applyRecursive(
    resolvePattern(query.pattern, currentPath),
    Boolean(query.recursive)
  )
  const includeIndex = explicitlyTargetsIndex(pattern)

  let entries = contentIndex.filter((entry) => {
    if (entry.path === currentPath) return false
    if (entry.path === '404.md' || entry.path.endsWith('/404.md')) return false
    if (!includeIndex && entry.path.endsWith('index.md')) return false
    return matchGlob(pattern, entry.path)
  })

  entries = sortEntries(entries, query.sort ?? 'title')

  if (typeof query.limit === 'number' && query.limit >= 0) {
    return entries.slice(0, query.limit)
  }

  return entries
}

function buildEntry(importPath: string, raw: string): ContentEntry {
  const path = normalizeImportPath(importPath)
  const { frontmatter, body } = parseFrontmatter(raw)
  const title =
    stringValue(frontmatter.title) ??
    extractH1(body) ??
    readableFilename(path)

  return {
    path,
    url: markdownPathToUrl(path),
    title,
    date: stringValue(frontmatter.date),
    excerpt: stringValue(frontmatter.description) ?? extractExcerpt(body),
    tags: arrayValue(frontmatter.tags)
  }
}

function normalizeImportPath(importPath: string): string {
  return normalizePath(importPath).replace(/^(\.\.\/){2}/, '')
}

function normalizePath(path: string): string {
  return path.replace(/\\/g, '/').replace(/^\/+/, '')
}

function dirname(path: string): string {
  const normalized = normalizePath(path)
  const index = normalized.lastIndexOf('/')
  return index === -1 ? '' : normalized.slice(0, index)
}

function resolvePattern(pattern: string, currentPath: string): string {
  const normalizedPattern = normalizePath(pattern)

  if (normalizedPattern.startsWith('./')) {
    return joinPath(dirname(currentPath), normalizedPattern.slice(2))
  }

  if (normalizedPattern.startsWith('../')) {
    return normalizeRelativePath(joinPath(dirname(currentPath), normalizedPattern))
  }

  return normalizedPattern
}

function applyRecursive(pattern: string, recursive: boolean): string {
  if (!recursive || pattern.includes('**')) return pattern

  const index = pattern.lastIndexOf('/')
  if (index === -1) return `**/${pattern}`

  return `${pattern.slice(0, index)}/**/${pattern.slice(index + 1)}`
}

function joinPath(...parts: string[]): string {
  return parts.filter(Boolean).join('/')
}

function normalizeRelativePath(path: string): string {
  const stack: string[] = []

  for (const segment of path.split('/')) {
    if (!segment || segment === '.') continue
    if (segment === '..') {
      stack.pop()
      continue
    }
    stack.push(segment)
  }

  return stack.join('/')
}

function explicitlyTargetsIndex(pattern: string): boolean {
  return !pattern.includes('*') && /(^|\/)index\.md$/.test(pattern)
}

function matchGlob(pattern: string, path: string): boolean {
  return matchSegments(pattern.split('/'), path.split('/'))
}

function matchSegments(patternSegments: string[], pathSegments: string[]): boolean {
  const [patternHead, ...patternTail] = patternSegments

  if (patternHead === undefined) return pathSegments.length === 0

  if (patternHead === '**') {
    return (
      matchSegments(patternTail, pathSegments) ||
      (pathSegments.length > 0 && matchSegments(patternSegments, pathSegments.slice(1)))
    )
  }

  const [pathHead, ...pathTail] = pathSegments
  if (pathHead === undefined) return false

  return matchSegment(patternHead, pathHead) && matchSegments(patternTail, pathTail)
}

function matchSegment(pattern: string, segment: string): boolean {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '[^/]*')
    .replace(/\?/g, '[^/]')

  return new RegExp(`^${escaped}$`).test(segment)
}

function markdownPathToUrl(path: string): string {
  const withoutExtension = path.replace(/\.md$/, '')

  if (withoutExtension === 'index') return '/'
  if (withoutExtension.endsWith('/index')) {
    return `/${withoutExtension.slice(0, -'/index'.length)}/`
  }

  return `/${withoutExtension}`
}

function parseFrontmatter(raw: string): { frontmatter: Frontmatter; body: string } {
  if (!raw.startsWith('---\n')) return { frontmatter: {}, body: raw }

  const end = raw.indexOf('\n---', 4)
  if (end === -1) return { frontmatter: {}, body: raw }

  const source = raw.slice(4, end).trim()
  const body = raw.slice(end + 4).replace(/^\s+/, '')

  return { frontmatter: parseYamlSubset(source), body }
}

function parseYamlSubset(source: string): Frontmatter {
  const result: Frontmatter = {}
  const lines = source.split(/\r?\n/)

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line)
    if (!match) continue

    const key = match[1]
    const rawValue = match[2].trim()

    if (!rawValue) {
      const values: string[] = []
      while (index + 1 < lines.length) {
        const next = lines[index + 1]
        const item = /^\s*-\s+(.+)$/.exec(next)
        if (!item) break
        values.push(unquote(item[1].trim()))
        index += 1
      }

      result[key] = values.length ? values : ''
      continue
    }

    if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
      result[key] = rawValue
        .slice(1, -1)
        .split(',')
        .map((item) => unquote(item.trim()))
        .filter(Boolean)
      continue
    }

    result[key] = unquote(rawValue)
  }

  return result
}

function unquote(value: string): string {
  return value.replace(/^['"]|['"]$/g, '')
}

function stringValue(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed || undefined
}

function arrayValue(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  if (typeof value === 'string' && value.trim()) {
    return [value.trim()]
  }

  return []
}

function extractH1(body: string): string | undefined {
  const match = /^#\s+(.+)$/m.exec(body)
  return match ? cleanInlineMarkdown(match[1]) : undefined
}

function extractExcerpt(body: string): string | undefined {
  const withoutCode = body.replace(/```[\s\S]*?```/g, '')
  const paragraphs = withoutCode.split(/\n\s*\n/)

  for (const paragraph of paragraphs) {
    const text = paragraph.trim()
    if (!text || text.startsWith('#') || text.startsWith('---')) continue
    if (text.startsWith('<') || text.startsWith(':::')) continue
    return cleanInlineMarkdown(text.replace(/\s+/g, ' '))
  }

  return undefined
}

function cleanInlineMarkdown(value: string): string {
  return value
    .replace(/#+$/, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .trim()
}

function readableFilename(path: string): string {
  const parts = path.replace(/\.md$/, '').split('/')
  const name = parts.at(-1) === 'index' ? parts.at(-2) ?? 'home' : parts.at(-1) ?? 'note'

  return name
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function sortEntries(entries: ContentEntry[], sort: AutoIndexSort): ContentEntry[] {
  return [...entries].sort((a, b) => {
    if (sort === 'date-desc') return compareDates(b.date, a.date) || compareTitles(a, b)
    if (sort === 'date-asc') return compareDates(a.date, b.date) || compareTitles(a, b)
    return compareTitles(a, b)
  })
}

function compareDates(a?: string, b?: string): number {
  if (!a && !b) return 0
  if (!a) return 1
  if (!b) return -1
  return Date.parse(a) - Date.parse(b)
}

function compareTitles(a: ContentEntry, b: ContentEntry): number {
  return a.title.localeCompare(b.title)
}
