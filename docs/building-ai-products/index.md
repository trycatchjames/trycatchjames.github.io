---
title: Building AI Products
description: AI experiments, prototypes, and builds.
---

# Building AI Products

Building LLMs into products (well).

I used to think that AI products were basically the same thing as agents. The LLM acts as a big brain and the rest of the software is just a thin layer for the LLM to use to do it's thing. I now think of the harness code that wraps the LLM more like a spinal cord. It's job is different but equally as important as the brain.

The code that surrounds the LLM is advancing as quickly as the LLM itself. I think it's possible that if the models stopped progressing at all, we would continue to squeeze more juice from AI software as we learn how to build better systems around the LLMs. I also think the harness logic is increasingly influencing the training logic for the next generations of LLMs. It's not enough to be a good language model if the model can't properly work with the harness code surrounding it.

To see the difference between the raw LLM and a well packaged AI product, I challenge you to try to create your own assistant like Claude or ChatGPT. The raw LLMs are dumber than you might think. What logic is happening in the harness code to get such reliable results?

For the last 15 years I've been involved in building software in some way and in the pre AI era I felt like I was converging on a good understanding of what goes into building most types of software. My career was built on deterministic logic and when you had fuzzy logic, you could generally find a solution in the form of search, Machine Learning or clever design. 

Integrating an LLM into software is a new paradigm. We are still discovering the tools, architecture and techniques in how best to do it. This section of the site, is dedicated to me learning this in public.

## [The Core Agent Loop Explained](./core-llm-loop-explained)

There's a couple of techniques we can use to build software around LLMs. Some of these have been turned into informal standards and built into how the models are trained. So when selecting a model, particularly the smaller models, be aware of this.

## Agents

The term "Agents" has increasingly been stretched to fit new definitions. Generally I would call anything that is a multi-turn interaction with an LLM where it's given a goal and not told how to achieve that goal an agent.

```
# Workflow / LLM call
Here's some context loaded in, answer this users question...
(LLM tries to one shot a response based off it's training and the prompt)

# Agent
Here's some tool calls for you to use, answer this users question...
(Agent may take several turns using tools and thinking before responding)
```

Any AI based product will typically be made up of workflows and agents as the building blocks. Some AI based products could be called agents as well (eg. Claude Code, Codex). 

## Tool Calls and Context

Tool calls are a structured response the LLM can give to invoke a function. A tool call also contains the information about when to use the tool call as part of it's definition. An LLM can respond with several tool calls at once but if calling one tool call requires the results of another tool call, then this needs to be done in multiple steps.

{{WIP}}




