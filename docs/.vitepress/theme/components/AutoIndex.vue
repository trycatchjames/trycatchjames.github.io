<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { queryContent } from '../../utils/contentIndex'
import type { AutoIndexSort } from '../../utils/contentIndex'

type AutoIndexProps = {
  pattern: string
  recursive?: boolean
  showDate?: boolean
  showExcerpt?: boolean
  showTags?: boolean
  compact?: boolean
  card?: boolean
  sort?: AutoIndexSort
  limit?: number
}

const props = withDefaults(defineProps<AutoIndexProps>(), {
  recursive: false,
  showDate: false,
  showExcerpt: false,
  showTags: false,
  compact: false,
  card: false,
  sort: 'title',
  limit: undefined
})

const { page } = useData()

const entries = computed(() =>
  queryContent({
    pattern: props.pattern,
    recursive: props.recursive,
    sort: props.sort,
    limit: props.limit,
    currentPath: page.value.relativePath
  })
)
</script>

<template>
  <div
    class="auto-index"
    :class="{
      'auto-index--compact': compact,
      'auto-index--cards': card
    }"
  >
    <p v-if="entries.length === 0" class="auto-index__empty">No notes found.</p>

    <article v-for="entry in entries" :key="entry.path" class="auto-index__entry">
      <h2 class="auto-index__title">
        <a :href="withBase(entry.url)">{{ entry.title }}</a>
      </h2>

      <div v-if="showDate || showTags" class="auto-index__meta">
        <time v-if="showDate && entry.date" :datetime="entry.date">
          {{ entry.date }}
        </time>

        <span v-if="showTags && entry.tags.length" class="auto-index__tags">
          <span v-for="tag in entry.tags" :key="tag" class="auto-index__tag">
            {{ tag }}
          </span>
        </span>
      </div>

      <p v-if="showExcerpt && entry.excerpt" class="auto-index__excerpt">
        {{ entry.excerpt }}
      </p>
    </article>
  </div>
</template>

<style scoped>
.auto-index {
  display: grid;
  gap: 1.1rem;
  margin: 1.5rem 0;
}

.auto-index__empty {
  color: var(--vp-c-text-2);
  margin: 0;
}

.auto-index__entry {
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 1rem;
}

.auto-index--cards {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
}

.auto-index--cards .auto-index__entry {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
}

.auto-index--compact {
  gap: 0.45rem;
}

.auto-index--compact .auto-index__entry {
  padding-top: 0.45rem;
}

.auto-index__title {
  border-top: 0;
  font-size: 1rem;
  line-height: 1.35;
  margin: 0;
  padding-top: 0;
}

.auto-index__meta {
  align-items: center;
  color: var(--vp-c-text-2);
  display: flex;
  flex-wrap: wrap;
  font-size: 0.86rem;
  gap: 0.5rem;
  margin-top: 0.35rem;
}

.auto-index__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.auto-index__tag {
  background: var(--vp-c-default-soft);
  border-radius: 999px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  padding: 0 0.5rem;
}

.auto-index__excerpt {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.55;
  margin: 0.45rem 0 0;
}
</style>
