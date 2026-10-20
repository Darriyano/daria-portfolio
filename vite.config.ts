import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import catalog from './src/data/projectCatalog.json' with { type: 'json' }

// Emit real directory entries: Pages can serve every project without a 404 fallback.
function projectEntries(): Plugin {
  return {
    name: 'portfolio-project-entries',
    enforce: 'post',
    generateBundle(_, bundle) {
      const index = bundle['index.html']
      if (!index || index.type !== 'asset') throw new Error('Missing app HTML')
      for (const project of catalog) {
        const route = `${project.category === 'case' ? 'cases' : 'quests'}/${project.slug}`
        const title = `${project.title} (${project.year}) — Daria`
        const escape = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!)
        this.emitFile({ type: 'asset', fileName: `${route}/index.html`, source: String(index.source).replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`) })
      }
      // Unknown routes retain an honest 404; known routes have their own entries.
      this.emitFile({ type: 'asset', fileName: '404.html', source: index.source })
    },
  }
}
export default defineConfig({
  plugins: [react(), projectEntries()],
  base: process.env.DEPLOY_BASE_PATH || '/',
})
