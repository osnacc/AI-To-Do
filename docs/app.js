const GROQ_API_KEY = "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";

const generateBtn = document.getElementById('generate-btn');
const goalInput = document.getElementById('goal-input');

generateBtn.addEventListener('click', async () => {
    const goal = goalInput.value.trim();
    if (!goal) return;

    if (typeof showLoading === 'function') showLoading();

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    { 
                        role: 'system', 
                        content: 'You are a task decomposition assistant. Return ONLY a valid JSON object without markdown formatting in this structure: {"goal":"...","summary":"...","tasks":[{"id":1,"title":"...","description":"...","priority":"medium","estimated_minutes":30,"dependencies":[]}]}' 
                    },
                    { role: 'user', content: goal }
                ]
            })
        });

        const data = await response.json();
        const rawContent = data.choices[0].message.content;
        const cleanJson = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedPlan = JSON.parse(cleanJson);

        if (typeof renderPlan === 'function') renderPlan(parsedPlan);
        if (typeof savePlan === 'function') savePlan(parsedPlan);

    } catch (err) {
        console.error('Error generating plan:', err);
        if (typeof showError === 'function') showError('Failed to generate plan.');
    } finally {
        if (typeof hideLoading === 'function') hideLoading();
    }
});