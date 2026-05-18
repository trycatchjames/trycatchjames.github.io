import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Notes to Self',
  description: 'AI notes, experiments, and learning in public.',
  base: '/',
  appearance: false,
  cleanUrls: true,
  lastUpdated: true,
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    nav: [
      { text: 'Using AI', link: '/using-ai/' },
      { text: 'Building AI Products', link: '/building-ai-products/' },
      { text: 'Blog', link: '/blog/' },
      { text: 'Glossary', link: '/glossary' }
    ],
    sidebar: [
      {
        text: 'Garden',
        items: [
          { text: 'Home', link: '/' },
          { text: 'Using AI', link: '/using-ai/' },
          { text: 'Building AI Products', link: '/building-ai-products/' },
          { text: 'Blog', link: '/blog/' },
          { text: 'Glossary', link: '/glossary' }
        ]
      },
      {
        text: 'Using AI',
        items: [
          { text: 'Agents', link: '/using-ai/agents/' },
          { text: 'Tool Calling', link: '/using-ai/agents/tool-calling' }
        ]
      }
    ],
    search: {
      provider: 'local'
    }
  }
})
