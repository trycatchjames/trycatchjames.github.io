---
title: Tool Call Design
description: AI experiments, prototypes, and builds.
---
# Tool Call Design

Tool calls are essential in both workflow steps and agents. In this article I want to explore how you properly design tool calls.

In [Core LLM Loop Explained](./core-llm-loop-explained) we looked at the API structure for LLM calls. The tool call definitions are sent as part of each request and they are a structured response the LLM can give to invoke a function. Each tool call definition costs context but if there's not enough information in the tool call definition, the agent will fumble around trying to use it.

## Basic Anatomy of a Tool Call

The schema of a tool call defines the input arguments. You can model nearly any JSON data structure in here but keeping it simpler is good practice.

```typescript
{
  name: string,          // snake_case, what the model calls
  description: string,   // when and how to use it
  input_schema: {        // JSON Schema object describing the arguments
    type: "object",      // always "object" at the top level
    properties: { ... },
    required: [ ... ]    // array of required property names
  }
}
```
## Name

The tool call name should be something that indicates to the agent what the tool does. Just like in traditional programming, we want it to be self descriptive. 

## Description

The description has a few things it's trying to achieve:
- What it does
- When to use it
- What it returns
- Boundaries/exclusions
- Side effects

```
// Example description
Retrieves the current status and tracking info for a customer order. Use when the user asks about an order, shipment, delivery date, or tracking number. Returns status (pending/shipped/delivered), carrier, and estimated delivery date. Requires a valid order ID - use search_orders first if you only have a customer name.
```

## Parameters

The data structure for parameters is built on JSON. So anything you can model in JSON can be modelled in parameters with some extra features on top.

The types are
- string
- number
- integer
- boolean
- null
- object
- array

#### Enums
Enums are for setting a list of options for a parameter, you can use it with strings, numbers and integers.

#### Min/Max
You can set min/max for arrays, strings and numbers.

#### Union types
You can use union types to describe different payload shapes with structures with anyOf/oneOf. I haven't tested this in depth but not all models will be able build the correct payload for unions.
```typescript
properties: {
  recipient_type: {
    type: "string",
    enum: ["email", "sms", "push"],
    description: "The delivery channel"
  },
  recipient_address: {
    type: "string",
    description: "Email address, phone number (+E.164), or device token depending on recipient_type"
  }
},
required: ["recipient_type", "recipient_address"]
```

## Best Practice Tips

I'll do my best to update this as things change in the ecosystem. The key thing with parameters to remember is an LLM is generating this shape and trying to call the tool. So if you make the parameter shape too complex it can lead to constant retries. 

- Only load in the tool calls the agents need to perform it's job. Tool many tool calls leads to models not using them correctly and costs you context
- In workflow steps, I find it's better to force the agent to use a tool call than try to capture raw conversation response and use it to perform an action
- Respond in concise text where possible, don't dump a full API response in, structure it in plain language
- Treat tool calls defensively as if it came from a web request, validate the shape and enforce permission boundaries

#### Splitting tool calls

Claude has advised me to split tool calls down to avoid things like having a mode argument that changes the function of the tool call entirely. I haven't tested this properly yet so buyer beware:

```
// Instead of
do_math(number, number, mode)

// It's better to
add_numbers(number, number)
subtract_numbers(number, number)
etc.
```
