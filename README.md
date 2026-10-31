# Devlog 5

> Turn any goal written in natural language into a structured, actionable to-do list. Powered by Groq AI.

## Progress Done

It's the final development session. The app is fully implemented and working end-to-end: the user types any goal, gets back a structured AI-generated plan as task cards, checks off tasks, and the whole state persists in the browser. I finished the interaction layer (progress bar, statistics, localStorage persistence, clear plan) and polished the UI with animations, hover states, and an empty state. The project is now feature-complete and runs via a local Node.js server.

## Features Added/Worked on

- Progress bar
- Task counter (`3 / 8 tasks completed`) and live percentage
- Total estimated time calculated from all tasks
- Priority statistics (High / Medium / Low counts)
- Save full plan + checkbox state to localStorage
- Automatic restore of plan and checked tasks on page reload
- Clear Plan button to wipe localStorage and return to empty state
- Empty state hint shown when no plan exists
- Fixed localStorage edge cases with try / catch
- Added `data-task-id` on cards for reliable state restoration 

## What new I learnt

- I learnt how localStorage works and why JSON.stringify / JSON.parse are required
- I learnt why localStorage access must be wrapped in try / catch (private mode, quota)
- I learnt how to restore UI state from storage on page load
- I learnt how CSS animations work with animation-delay for staggered effects
- I learnt that CSS specificity matters when the same class is styled twice
- I learnt how to design an empty state that guides the user
- I learnt how data-task-id attributes bridge DOM and app state
- I learnt to keep the app resilient: even if one part fails, the rest keeps working

## Try It (How to Run Locally)

To use the app, download all project files and run the backend server locally on your machine:

1. **Clone or Download** this repository to your computer.
2. Open your terminal in the project folder and install dependencies:
   ```bash
   npm install