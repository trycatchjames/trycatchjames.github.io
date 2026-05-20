---
title: Tool Call Design
description: AI experiments, prototypes, and builds.
---
# Tool Call Design

Tool calls are a structured response the LLM can give to invoke a function. A tool call also contains the information about when to use the tool call as part of it's definition. An LLM can respond with several tool calls at once but if calling one tool call requires the results of another tool call, then this needs to be done in multiple steps.