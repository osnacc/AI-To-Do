require('dotenv').config();

const path = require('path');
const express = require('express');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'docs')));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/generate', (req, res) => {
  const { goal } = req.body || {};

  // Validation
  if(typeof goal !== 'string' || goal.trim().length === 0) {
    return res.status(400).json({
      error: 'Goal is required and must be a non-empty string.'
    });
  }
  if(goal.length > 500){
    return res.status(400).json({
      error: 'Goal is too long. Maximum 500 characters.'
    });
  }
  // Fake structured response (placeholder untill OpenAI is wired in) 
  const plan = {
    goal: goal.trim(),
    summary: 'A short, structured plan generated for the given goal.',
    tasks: [
      {
        id: 1,
        title: 'Define the final outcome',
        description: 'Write down exactly what "done" looks like for this goal.',
        priority: 'high',
        estimated_minutes: 20,
        dependencies: []
      },
      {
        id: 2,
        title: 'List the required resources',
        description: 'Identify tools, people, and information needed to start.',
        priority: 'medium',
        estimated_minutes: 30,
        dependencies: [1]
      },
      {
        id: 3,
        title: 'Break the goal into milestones',
        description: 'Split the goal into 3-5 major checkpoints.',
        priority: 'high',
        estimated_minutes: 45,
        dependencies: [1]
      }
    ]
  };
  res.json(plan);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
