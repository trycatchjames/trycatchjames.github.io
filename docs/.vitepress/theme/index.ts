import DefaultTheme from 'vitepress/theme'
import { useData, type Theme } from 'vitepress'
import { defineComponent, h } from 'vue'
import CustomNotFound from './components/CustomNotFound.vue'
import AutoIndex from './components/AutoIndex.vue'
import './styles/shared.css'
import './styles/vitepress.css'

const Layout = defineComponent({
  name: 'CustomLayout',
  setup() {
    const { page } = useData()

    return () =>
      h(DefaultTheme.Layout, null, {
        'not-found': () => h(CustomNotFound),
        'doc-before': () =>
          page.value.relativePath === '404.md' ? h(CustomNotFound) : null
      })
  }
})

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('AutoIndex', AutoIndex)
  }
} satisfies Theme
