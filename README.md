# AI To Do List

> Turn any goal written in natural language into a structured, actionable to-do list. Powered by OpenAI.

## Today

Finished the frontend logic for the goal input screen and built the backend endpoint that will eventually call the AI.

Frontend now handles:
- Live character counter for the textarea
- "Generate Plan" button with loading and error states
- Spinner shown during the request, cleared on completion
- Error box for empty input

Backend exposes `POST /api/generate`. It validates the incoming goal (non-empty string, max 500 characters) and currently returns a hardcoded JSON plan with three tasks. The AI call is not wired in yet - the endpoint exists so the data shape and client flow can be tested before OpenAI is added.

## Progress

- `docs/index.html` - header, goal card, hidden loading/error/dashboard sections
- `docs/style.css` - dark theme, gradients, glass cards, responsive layout
- `docs/app.js` - element wiring, character counter, loading/error toggles, button handler
- `server.js` - Express server; serves `/docs`; `GET /api/health`; `POST /api/generate` with validation and a fake JSON response
- `package.json` - scripts `start` / `dev`, deps: express, dotenv, openai
- `.env.example` - template for `PORT` and `OPENAI_API_KEY`
- `.gitignore` - protects `.env` and `node_modules/`

No AI yet - next step is connecting OpenAI `gpt-4o-mini` with Structured Outputs.

## Goal

Remove the "where do I start?" problem. A user types any goal - "build a portfolio website", "prepare for a C++ exam", "organize a birthday party" - and gets back a concrete, ordered list of tasks with priorities, time estimates, and dependencies.

The AI must not just rephrase the goal. It must decompose it into specific, actionable steps.

## Next Steps

- Connect OpenAI `gpt-4o-mini` with Structured Outputs (JSON Schema)
- Replace the fake response in `/api/generate` with a real model call
- Render task cards on the frontend: title, description, priority, time, dependencies
- Interactive checkbox + progress bar + total time
- Priority statistics
- Persist plan to `localStorage`
- Polish, mobile pass, deploy

## Stack

- Frontend: HTML, CSS, vanilla JS
- Backend: Node.js, Express 5
- AI: OpenAI gpt-4o-mini, Structured Outputs (planned)
- Persistence: `localStorage` (planned)
- Preview: GitHub Pages (`/docs`)

## Try It

[Live Demo](https://osnacc.github.io/AI-To-Do/) - UI only, backend not connected yet