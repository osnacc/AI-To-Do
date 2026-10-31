# Devlog 5

> Turn any goal written in natural language into a structured, actionable to-do list. Powered by Groq AI.

## Progress Done

It's the final development session. The app is fully implemented and working end-to-end: the user types any goal, gets back a structured AI-generated plan as task cards, checks off tasks, and the whole state persists in the browser. I finished the interaction layer (progress bar, statistics, localStorage persistence, clear plan) and polished the UI with animations, hover states, and an empty state. The project is now feature-complete, running 100% client-side directly on GitHub Pages without requiring an external backend server.

## Features Added/Worked on

- Switched API provider and integrated Groq (`openai/gpt-oss-20b`) for ultra-fast task generation
- Refactored project architecture to direct browser-level API requests with strict DOM manipulation (zero-HTML-in-JS policy)
- Progress bar
- Task counter (`3 / 8 tasks completed`) and live percentage
- Total estimated time calculated from all tasks
- Priority statistics (High / Medium / Low counts) with dynamic AI distribution
- Save full plan + checkbox state to localStorage
- Automatic restore of plan and checked tasks on page reload
- Clear Plan button to wipe localStorage and return to empty state
- Empty state hint shown when no plan exists
- Fixed localStorage edge cases with try / catch
- Added `data-task-id` on cards for reliable state restoration 

## What new I learnt

- I learnt how to execute direct client-side API requests using Groq and OpenAI-compatible endpoints
- I learnt how localStorage works and why JSON.stringify / JSON.parse are required
- I learnt why localStorage access must be wrapped in try / catch (private mode, quota)
- I learnt how to restore UI state from storage on page load
- I learnt how CSS animations work with animation-delay for staggered effects
- I learnt that CSS specificity matters when the same class is styled twice
- I learnt how to design an empty state that guides the user
- I learnt how data-task-id attributes bridge DOM and app state
- I learnt to keep the app resilient: even if one part fails, the rest keeps working

## Try It (Live Demo)

Link: https://osnacc.github.io/AI-To-Do/

Just open the link, type any goal, click "Generate Plan", check off tasks, and reload the page to test state persistence!