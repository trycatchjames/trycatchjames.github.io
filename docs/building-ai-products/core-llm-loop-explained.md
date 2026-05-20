---
title: Core AI Loop Explained
description: AI experiments, prototypes, and builds.
---

# Core AI Loop Explained

Interacting with a model is fundamentally text in and text streamed out. There's also multi-modal models that can handle different types of inputs and outputs like images and video but it's a similar concept.

I found what gave me the clearest sense of what these models are, was using ollama directly without the request/response getting in the way. I can see the thinking process as part of the response. I may not fully understand it but "thinking" appears to simply be some prompt engineering that's been worked into the training process of the model itself. You can see the response stream back which is also helpful for understanding.

```
~ $ ollama run qwen3.6:35b

>>> hello

Thinking...
Here's a thinking process:

1.  **Analyze User Input:** The user said "hello". This is a standard greeting.
2.  **Identify Intent:** The user is initiating a conversation. No specific question or task is provided.
3.  **Determine Response Strategy:**
   - Acknowledge the greeting warmly
   - Offer assistance
   - Keep it open-ended to encourage further interaction
   - Maintain a friendly, helpful tone
4.  **Draft Response (Mental):** Hello! How can I assist you today? Feel free to ask me anything or let me know what you'd like to talk about.
5.  **Refine Response:** Check for clarity, tone, and appropriateness. The draft is good. It's polite, open, and invites the user to specify their needs.
6.  **Final Output Generation:** Match the refined response.✅
...done thinking.

Hello! 👋 How can I help you today? Feel free to ask a question, request assistance, or just chat—I'm here for you!
```

This is a good start but if we look at the request/response structure in the API to see what raw building blocks we can work with.

## Analysing the HTTP Request

The models have been tuned to work in a HTTP request. Even locally run models will run a HTTP server in front of the model and match a popular format like OpenAI's API structure. There's some difference between the exact API structure between providers but the same building blocks are generally available.

```json
// Request
"model": "claude-sonnet-4-20250514"
"system": "You are a helpful assistant. Today's date is May 19 2026." // System prompt
"tools": [ {...} ] // Tool definitions
"messages": [ {...} ] // Full history of the conversation sent in each round
"stream": true // Stream the response back in chunks
"max_tokens": 1024 // Hard limit on tokens
"temperature": 0.7 // Used with top_p to control randomness/creativity
"top_p": 0.9 // Helps exlude unlikely tokens to reduce the chance of gibberish when temperature is higher

// Response
"id": "msg_01XxXxXx"
"stop_reason": "end_turn|tool_use|max_tokens|stop_sequence"
"usage": { ... } // Token usage
"content": [ {...} ] // More details below
```

## Types of Content Responses
#### `text`

The most common. Plain generated text.

```json
{ "type": "text", "text": "Here is your answer..." }
```

#### `tool_use`

The model wants to call a tool. Exercise defensive programming when using tool input, validate the structure and use standard security practice.

```json
{
  "type": "tool_use",
  "id": "toolu_01Ab",
  "name": "web_search",
  "input": { "query": "Tokyo weather" }
}
```

#### `tool_result`

Not a model output — this is what **you** send back after running a tool. Goes in the next request as a user message.

```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01Ab",
  "content": "Tokyo: 24°C, partly cloudy" // can be array
}
```

#### `image`

Used in **requests** to send an image to the model. Not typically emitted by the model in responses. Source can also be `"url"` instead of `"base64"`.

```json
{
  "type": "image",
  "source": {
    "type": "base64",
    "media_type": "image/jpeg",
    "data": "/9j/4AAQ..."
  }
}
```

#### `document`

For sending PDFs or other documents as input.

```json
{
  "type": "document",
  "source": {
    "type": "base64",
    "media_type": "application/pdf",
    "data": "JVBERi0x..."
  }
}
```

#### `thinking`

Anthropic-specific, only on models with extended thinking enabled. The model's internal reasoning before it answers — a scratchpad you can optionally show the user.

```json
{
  "type": "thinking",
  "thinking": "The user is asking about X, I should consider..."
}
```

#### `error`

If something goes wrong mid-stream you may also get:

```json
{ 
  "type": "error",
  "error": {
	"type": "overloaded_error",
	"message": "..." 
  }
}
```

## Putting it together - Tool use, Context, System messages

When I dug into it, I realised there was less levers to pull than I first expected. The real secret sauce is (of course) how you use it and the model you select.

All AI systems boil down to 3 key things in my mind
1. System messages - has a huge impact on the result from the model. Changes to the system message need to be considered carefully
2. Tool calls - any action an agent can do is a tool call. We'll dig into what makes a good tool call request and response in dedicated articles
3. Context - context is the message/full conversation that the model can use to respond. Managing context is a highly nuanced topic and it can be effected by model selection, use case and chat history.

## Other observations

- All requests are stateless. To achieve a conversation, the entire conversation is sent back in each subsequent request. This can add up as each turn compounds token usage which is where caching becomes important.
- Because the API calls are stateless, you can seed a conversation without having to get the model to perform each action. It also opens doors to compacting conversations and other techniques to reduce token usage.
- You should use external fail safes for stopping a conversation if it goes off the rails. You might get into a situation where a model never achieves the desired outcome and keeps trying, so having a maximum amount of turns or some other manual trigger can halt the conversation.
- API responses are slow, so streaming can be important for showing the user what's happening and they don't feel like it's just not working at all.
- Model training and size has a massive impact on how an agent performs. It's a good idea to approach this with a data science mindset and not a software engineer mindset
- MCP, skills, sub-agents, etc. are all higher level concepts that fundamentally use these same building blocks. They will use a combination of system prompts, tool calls and context management to achieve an outcome. 
- Tool call availability is not free, if you have hundreds of tool calls it will eat up context. So dynamically swapping in and out tool calls in different scenarios is important.
