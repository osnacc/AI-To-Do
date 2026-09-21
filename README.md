# AI To Do List

> A web app that turns a goal discribed in natural language into a structured, actionable to-do list.Powered by OpenAI.

## Today

Today i restructured the project into a single directory layout and finished the UI skeleton for the goal input screen.

The frontend now renders:
- Header with gradient title ("AI To Do List")
- Glassmorphism card with a large textarea for the goal
- Character counter (static - logic comes later)
- "Generate Plan" button with hover and glow effects
- Hidden loading, error, and dashboard sections ready for JS logic

The backend is a minimal Express server that serves the static frontend and exposes a health-check endpoint. The docs/ folder is set up so GitHub Pages can serve the UI as a static preview.

No AI integration yet - that comes in the next steps. The goal of this phase was to lock down the layout, theming, and file structure before adding async behavior.

## Completed

- server.js - Express server, serves /docs, exposes GET /api/health
- package.json - scripts start and dev (`node --watch`), dependencies: express, dotenv, openai
- .env.example - template for PORT and OPENAI_API_KEY (real .env is gitignored)
- .gitignore - protects .env and node_modules/
- docs/index.html - main page: header, goal card, hidden loading/error/dashboard sections
- docs/style.css - dark theme, radial gradient background, glass cards, gradient button, responsive layout (< 520px)

## Goal

My goal is to build a tool that removes the "where do I start?" problem. A user types any goal - "build a portfolio website", "prepare for a C++ exam", "organize a birthday party" - and the app returns a concrete, ordered list of tasks with priorities, time estimates, and dependencies.

The AI must not simply rephrase the goal. It must decompose it into specific, actionable steps.

## Architecture

Browser (frontend in `docs/`)
    ↓ fetch POST /api/generate
Node.js + Express (`server.js`)
    ↓ OpenAI SDK
OpenAI API (gpt-4o-mini, Structured Output)
    ↓ JSON
Frontend renders tasks as cards

The OpenAI API key lives only on the server, in .env. It is never shipped to the browser.

## Next Steps

- docs/app.js - element wiring, character counter, loading/error toggles
- POST /api/generate - backend endpoint with a fake JSON response (schema first, AI later)
- Connect OpenAI gpt-4o-mini with Structured Outputs (JSON Schema)
- Render task cards: title, description, priority, estimated time, dependencies
- Interactive checkbox + progress bar + total time calculation
- Priority statistics
- Save plan to localStorage
- Polish: transitions, micro-animations, mobile pass
- Deploy to Render (backend + static frontend together)

## Stack

- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js, Express 5
- AI: OpenAI gpt-4o-mini with Structured Outputs
- Persistence: localStorage (planned)
- Static preview: GitHub Pages (`/docs`)

## Try It
                          
- [Live Demo](https://osnacc.github.io/AI-To-Do/) - UI only, backend not connected yet