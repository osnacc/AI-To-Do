const OpenAI = require('openai');

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// System prompt
// The model must return ONLY structured JSON matching the schema below
// No markdown, no explanations, no motivational text
const SYSTEM_PROMPT = `You are a task decomposition assistant.
Given a user's goal, you break it into a concrete, actionable to do list.

Rules:
- Identify the desired final outcome first.
- Produce 4 to 8 tasks. No more, no less.
- Every task must be specific and actionable. Never vague.
- BAD titles: "Do research", "Start coding", "Work on the project".
- GOOD titles: "Review JavaScript array methods with 5 exercises", "Create the homepage HTML structure".
- Do NOT repeat the user's goal as a task.
- Do NOT create duplicate tasks.
- Assign priority: high, medium, or low. Use "high" sparingly.
- Estimate realistic time in minutes (typically 20-120 per task).
- Set dependencies as an array of task IDs that must be done first.
- The task with id 1 must have an empty dependencies array.
- Order tasks logically: foundational tasks first.
- Do NOT include any text outside the JSON object.`;


const PLAN_SCHEMA = {
    name: 'task_plan',
    strict: true,
    schema: {
        type: 'object',
        properties: {
            goal: {
                type: 'string',
                description: 'Restated goal, clarified and specific.'
            },
            summary: {
                type: 'string',
                description: 'One or two sentences describing the plan.'
            },
            tasks:{
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: {type: 'integer'},
                        title: {type: 'string'},
                        description: {type: 'string'},
                        priority: {type: 'string', enum: ['high', 'medium', 'low'] },
                        estimated_minutes: {type: 'integer' },
                        dependencies: {
                            type: 'array',
                            items: {type: 'integer' }
                        }
                    },
                    required: [
                        'id',
                        'title',
                        'description',
                        'priority',
                        'estimated_minutes',
                        'dependencies'
                    ],
                    additionalProperties: false
                }
            }
        },
        required: ['goal', 'summary', 'tasks'],
        additionalProperties: false
    }
};


// Public API

async function generatePlan(goal){
    const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: goal }
        ],
        response_format: {
            type: 'json_schema',
            json_schema: PLAN_SCHEMA    
        }
    });

    const message = completion.choices[0].message;

    // Handle saety refusal (yes it is rare , but possible)
    if(message.refusal){
        throw new Error(`Model refused: ${message.refusal}`);
    }

    return JSON.parse(message.content);
}

module.exports = { generatePlan };