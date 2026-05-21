---
title: Tool Call Design
description: AI experiments, prototypes, and builds.
---
# Tool Call Design

Tool calls are the very lifeblood of any agent. In my mind it's the single distinguishing factor between a workflow step and an agent. In this article I want to explore how you properly design tool calls.

In [Core LLM Loop Explained](./core-llm-loop-explained) we looked at the API structure for LLM calls. The tool call definitions are sent as part of each request and they are a structured response the LLM can give to invoke a function. Each tool call definition costs context but if there's not enough information in the tool call definition, the agent will fumble around trying to use it.

## Basic Anatomy of a Tool Call

```typescript
{
  name: "get_weather",
  input_schema: {
    properties: {
      location: {
        type: "string",
        description: "City name and country code e.g. 'Tokyo, JP'. Do not use coordinates."
      },
      units: {
        type: "string",
        enum: ["celsius", "fahrenheit"],
        description: "Temperature unit. Default to celsius."
      }
    },
    required: ["location"]
  }
}
```

## Name and Description



## Current Best Practice

I'll do my best to update this as things change in the ecosystem.

- Only load in the tool calls the agents need to perform it's job. Tool many tool calls leads to models not using them correctly and costs you context
- 
- Respond in concise text where possible