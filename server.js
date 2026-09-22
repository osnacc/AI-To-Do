require('dotenv').config();

const path = require('path');
const express = require('express');
const { generatePlan } = require('./openai');

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

app.post('/api/generate', async (req, res) => {
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

  try {
    const plan = await generatePlan(goal.trim());
    res.json(plan);
  }catch (err) {
    console.error('OpenAI error:', err.message);

    if(err.status === 401) {
      return res.status(500).json({
        error: 'AI service authentication failed. Please check sever configuration.'
      });
    }

    if(err.status === 429) {
      return res.status(429).json({
        error: 'Too many requests. Please try again in a moment.'
      });
    }
    res.status(500).json({
      error: 'Failed to generate a plan. Please try again.'
    });
  }
  });
  
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


