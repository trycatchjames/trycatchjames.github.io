<script setup lang="ts">
import { withBase } from 'vitepress'
</script>

<template>
  <div class="not-found">
    <p class="not-found__code">404</p>
    <h1>Page Not Found</h1>
    <p>This page is not in the notes yet, or it moved during a refactor.</p>

    <nav aria-label="Not found navigation" class="not-found__links">
      <a :href="withBase('/')">Home</a>
      <a :href="withBase('/blog/')">Blog</a>
      <a :href="withBase('/concepts/')">Concepts</a>
      <a :href="withBase('/projects/')">Projects</a>
    </nav>
  </div>
</template>

<style scoped>
.not-found {
  margin: 0 auto;
  max-width: 640px;
  padding: 72px 24px 120px;
  text-align: center;
}

.not-found__code {
  color: var(--vp-c-brand-1);
  font-size: 4rem;
  font-weight: 700;
  line-height: 1;
  margin: 0;
}

.not-found h1 {
  font-size: 2rem;
  letter-spacing: 0;
  line-height: 1.2;
  margin: 1rem 0 0;
}

.not-found p {
  color: var(--vp-c-text-2);
  margin: 0.8rem auto 0;
}

.not-found__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.not-found__links a {
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 8px;
  color: var(--vp-c-brand-1);
  font-weight: 600;
  line-height: 1.4;
  padding: 0.45rem 0.85rem;
}

.not-found__links a:hover {
  border-color: var(--vp-c-brand-2);
  color: var(--vp-c-brand-2);
  text-decoration: none;
}
</style>
