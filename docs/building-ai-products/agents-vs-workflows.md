---
title: Agents vs Workflows
description: AI experiments, prototypes, and builds.
---

# Agents vs Workflows

The term "Agents" has increasingly been stretched to fit new definitions. Generally I would call anything that is a multi-turn interaction with an LLM where it's given a goal and not told how to achieve that goal an agent. A workflow is where the LLM interaction is simply a specialised step in a process. We can use both of these techniques when embedding AI in software.

```
# Workflow / LLM call
Here's some context loaded in, answer this users question...
(LLM tries to one shot a response based off it's training and the prompt)

# Agent
Here's some tool calls for you to use, answer this users question...
(Agent may take several turns using tools and thinking before responding)
```
