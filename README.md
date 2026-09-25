# Devlog 4

> Turn any goal written in natural language into a structured, actionable to-do list. Powered by OpenAI.

## Progress Done

It's the final development session. The app is fully deployed and working end-to-end: user opens the GitHub Pages link, types any goal, gets back a structured AI-generated plan as task cards, checks off tasks, and the whole state persists in the browser. I finished the interaction layer (progress bar, statistics, localStorage persistence, clear plan) and polished the UI with animations, hover states, and an empty state. The project is now feature-complete.

## Features Added/Worked on

- Progress bar with smooth width animation on checkbox click
- Task counter (`3 / 8 tasks completed`) and live percentage
- Total estimated time calculated from all tasks
- Priority statistics (High / Medium / Low counts)
- Save full plan + checkbox state to localStorage
- Automatic restore of plan and checked tasks on page reload
- Clear Plan button to wipe localStorage and return to empty state
- Empty state hint shown when no plan exists
- Card hover effect with subtle right shift 
- Card fade-in animation on first render
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

## Try It

[Live Demo](https://osnacc.github.io/AI-To-Do/) - fully working, backend on Render

**Note:** the first request may take up to 1 minute while the free Render instance wakes up. Subsequent requests are fast.