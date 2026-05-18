---
title: Tool Calling
description: Tool calling lets an AI system request structured actions instead of only producing text.
tags:
  - agents
  - tools
---

# Tool Calling

Tool calling lets an AI system request structured actions instead of only producing text.

In practice, this means the model can ask for a specific function with typed arguments, then use the result to continue the task. Good tool design keeps the action narrow, observable, and easy to validate.

## Notes

- Tools should have clear input schemas.
- Tool results should be compact and directly useful.
- The surrounding system should decide which tools are available for a given task.
