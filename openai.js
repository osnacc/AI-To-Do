const OpenAI = require('openai');

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1'
});

const SYSTEM_PROMPT = `You are a task decomposition assistant.
Given a user's goal, you break it into a concrete, actionable to-do list.
You MUST return ONLY a valid JSON object with no markdown formatting around it (no \`\`\`json).

The JSON object must have this exact structure:
{
  "goal": "Restated goal, clarified and specific.",
  "summary": "One or two sentences describing the plan.",
  "tasks": [
    {
      "id": 1,
      "title": "Specific task title",
      "description": "Task description",
      "priority": "medium",
      "estimated_minutes": 30,
      "dependencies": []
    }
  ]
}

Rules:
- Produce 4 to 8 tasks. No more, no less.
- Every task must be specific and actionable.
- Assign priority: "high", "medium", or "low".
- estimated_minutes must be an integer.
- dependencies must be an array of task IDs (id 1 has []).`;

async function generatePlan(goal){
    const completion = await client.chat.completions.create({
        model: 'openai/gpt-oss-20b',
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: goal }
        ]
    });

    const message = completion.choices[0].message.content;
    const cleanJson = message.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanJson);
}

module.exports = { generatePlan };