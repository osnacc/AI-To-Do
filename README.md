# Devlog 3

> Turn any goal written in natural language into a structured, actionable to-do list. Powered by OpenAI.

## Progress Done

It's the 7th hour into the project, and the app is now fully deployed and working end-to-end in the browser. A user opens the GitHub Pages link, types any goal, and the frontend sends a request to a live backend on Render, which calls gpt-4o-mini and returns structured task cards rendered on the page. I have connected OpenAI with Structured Outputs, added validation, loading and error states, interactive checkboxes, and deployed the backend with CORS configured for GitHub Pages.

## Features Added/Worked on

- Connected OpenAI gpt-4o-mini with Structured Outputs (JSON Schema)
- Created openai.js as an isolated module for the model call
- Added POST /api/generate with validation (non-empty string, max 500 chars)
- Added error mapping for 401, 429 and generic failures
- System prompt tuned to produce specific, actionable tasks with priorities, time estimates, and dependencies
- Rendered task cards with priority-colored left border, priority badge and estimated time
- Added interactive checkboxes with completed state (dimmed + strikethrough)
- Added live character counter for the textarea
- Added loading spinner and error box
- Deployed backend to Render (Free tier) with OPENAI_API_KEY as an environment variable
- Added CORS middleware allowing requests from GitHub Pages and localhost
- Configured frontend to switch API base URL between localhost and Render

## What new I learnt

- I learnt how Structured Outputs work in the OpenAI API (strict schema, additionalProperties)
- I learnt why API keys must live in .env on the server and never in frontend code
- I learnt that fetch does not throw on HTTP 4xx/5xx - you have to check response.ok manually
- I learnt how try / catch / finally works for cleaning up UI state on errors
- I learnt BEM-style class naming for state variants (taskCard--done)
- I learnt building DOM with createElement + appendChild instead of innerHTML (safer, no XSS)
- I learnt how CORS works and why browsers block cross-origin requests by default
- I learnt how to deploy a Node.js backend to Render and connect it to a static frontend on GitHub Pages

## Stack

- Frontend: HTML, CSS, vanilla JS
- Backend: Node.js, Express 5
- AI: OpenAI gpt-4o-mini with Structured Outputs
- Frontend hosting: GitHub Pages (/docs)
- Backend hosting: Render (Free tier)
- Persistence: localStorage (planned)

## Next Steps

- Progress bar and counter (3 / 8 tasks completed)
- Total estimated time and priority statistics
- Save plan and completion state to localStorage
- Polish: transitions, mobile pass

## Try It

[Live Demo](https://osnacc.github.io/AI-To-Do/) - fully working, backend on Render