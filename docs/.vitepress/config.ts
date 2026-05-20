import { defineConfig } from "vitepress";

const gardenSidebar = {
  text: "Garden",
  items: [
    { text: "Home", link: "/" },
    { text: "Blog", link: "/blog/" },
    { text: "Glossary", link: "/glossary" },
  ],
};

const buildingAiProductsSidebar = {
  text: "Building AI Products",
  items: [
    { text: "Overview", link: "/building-ai-products/" },
    {
      text: "Core AI Loop Explained",
      link: "/building-ai-products/core-llm-loop-explained",
    },
    {
      text: "Designing Tool Calls",
      link: "/building-ai-products/tool-call-design",
    },
    {
      text: "Agents vs Workflows",
      link: "/building-ai-products/agents-vs-workflows",
    },
  ],
};

const usingAiSidebar = {
  text: "Using AI",
  items: [
    { text: "Overview", link: "/using-ai/" },
    { text: "Agents", link: "/using-ai/agents/" },
    { text: "Tool Calling", link: "/using-ai/agents/tool-calling" },
  ],
};

const sidebar = [gardenSidebar, buildingAiProductsSidebar, usingAiSidebar];

export default defineConfig({
  title: "Notes to Self",
  description: "AI notes, experiments, and learning in public.",
  base: "/",
  appearance: false,
  cleanUrls: true,
  lastUpdated: true,
  markdown: {
    theme: "github-dark-default",
    lineNumbers: true,
  },
  themeConfig: {
    nav: [
      { text: "Using AI", link: "/using-ai/" },
      { text: "Building AI Products", link: "/building-ai-products/" },
      { text: "Blog", link: "/blog/" },
      { text: "Glossary", link: "/glossary" },
    ],
    sidebar: {
      "/building-ai-products/": sidebar,
      "/using-ai/": sidebar,
      "/": sidebar,
    },
    search: {
      provider: "local",
    },
  },
});
