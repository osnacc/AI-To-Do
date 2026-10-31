const GROQ_API_KEY = "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";

const generateBtn = document.getElementById('generateBtn');
const goalInput = document.getElementById('goalInput');
const charCount = document.getElementById('charCount');
const loadingSection = document.getElementById('loading');
const errorBox = document.getElementById('errorBox');
const errorText = document.getElementById('errorText');
const emptyState = document.getElementById('emptyState');
const clearBar = document.getElementById('clearBar');
const clearBtn = document.getElementById('clearBtn');
const dashboard = document.getElementById('dashboard');

const planTitle = document.getElementById('planTitle');
const planSummary = document.getElementById('planSummary');
const statsCount = document.getElementById('statsCount');
const progressFill = document.getElementById('progressFill');
const statsPercent = document.getElementById('statsPercent');
const statsTime = document.getElementById('statsTime');
const statsPriority = document.getElementById('statsPriority');
const taskList = document.getElementById('taskList');

let currentPlan = null;

goalInput.addEventListener('input', () => {
    charCount.textContent = `${goalInput.value.length} / 500`;
});

generateBtn.addEventListener('click', async () => {
    const goal = goalInput.value.trim();
    if (!goal) return;

    showLoading();
    hideError();

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'openai/gpt-oss-20b',
                messages: [
                    { 
                        role: 'system', 
                        content: 'You are a task decomposition assistant. Return ONLY a valid JSON object without markdown formatting in this structure: {"goal":"...","summary":"...","tasks":[{"id":1,"title":"...","description":"...","priority":"high","estimated_minutes":30,"dependencies":[]}]}. Crucial: Vary the "priority" field for each task dynamically using "high", "medium", or "low" based on the actual importance and urgency of the task.' 
                    },
                    { role: 'user', content: goal }
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errData = await response.text();
            console.error('Groq API Error Response:', errData);
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const rawContent = data.choices[0].message.content;
        const cleanJson = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
        
        currentPlan = JSON.parse(cleanJson);
        currentPlan.tasks = currentPlan.tasks.map(task => ({ ...task, completed: false }));

        renderPlan(currentPlan);
        savePlan(currentPlan);

    } catch (err) {
        console.error('Error generating plan:', err);
        showError('Failed to generate plan. Please try again.');
    } finally {
        hideLoading();
    }
});

clearBtn.addEventListener('click', () => {
    localStorage.removeItem('ai_todo_plan');
    currentPlan = null;
    dashboard.classList.add('dashboardHidden');
    clearBar.classList.add('clearBarHidden');
    emptyState.classList.remove('emptyStateHidden');
});

function renderPlan(plan) {
    emptyState.classList.add('emptyStateHidden');
    clearBar.classList.remove('clearBarHidden');
    dashboard.classList.remove('dashboardHidden');

    const completedTasks = plan.tasks.filter(t => t.completed).length;
    const totalTasks = plan.tasks.length;
    const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const totalTime = plan.tasks.reduce((acc, t) => acc + (t.estimated_minutes || 0), 0);

    const highPriority = plan.tasks.filter(t => t.priority === 'high').length;
    const mediumPriority = plan.tasks.filter(t => t.priority === 'medium').length;
    const lowPriority = plan.tasks.filter(t => t.priority === 'low').length;

    planTitle.textContent = plan.goal;
    planSummary.textContent = plan.summary;
    statsCount.textContent = `${completedTasks} / ${totalTasks} tasks completed`;
    progressFill.style.width = `${percent}%`;
    statsPercent.textContent = `${percent}% completed`;
    statsTime.textContent = `${totalTime} mins`;
    statsPriority.textContent = `${highPriority} High, ${mediumPriority} Medium, ${lowPriority} Low`;

    taskList.innerHTML = '';

    plan.tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = `taskCard priority-${task.priority} ${task.completed ? 'taskCard--done' : ''}`;
        card.setAttribute('data-task-id', task.id);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'taskCheckbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const body = document.createElement('div');
        body.className = 'taskBody';

        const title = document.createElement('div');
        title.className = 'taskTitle';
        title.textContent = task.title;

        const description = document.createElement('div');
        description.className = 'taskDescription';
        description.textContent = task.description;

        const meta = document.createElement('div');
        meta.className = 'taskMeta';

        const priorityBadge = document.createElement('span');
        priorityBadge.className = `taskPriority priority-${task.priority}`;
        priorityBadge.textContent = task.priority.toUpperCase();

        const timeBadge = document.createElement('span');
        timeBadge.className = 'taskTime';
        timeBadge.textContent = `⏱ ${task.estimated_minutes} mins`;

        meta.appendChild(priorityBadge);
        meta.appendChild(timeBadge);

        body.appendChild(title);
        body.appendChild(description);
        body.appendChild(meta);

        card.appendChild(checkbox);
        card.appendChild(body);

        taskList.appendChild(card);
    });
}

window.toggleTask = function(taskId) {
    if (!currentPlan) return;
    const task = currentPlan.tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderPlan(currentPlan);
        savePlan(currentPlan);
    }
};

function savePlan(plan) {
    try {
        localStorage.setItem('ai_todo_plan', JSON.stringify(plan));
    } catch (e) {
        console.error('Failed to save plan to localStorage:', e);
    }
}

function loadPlan() {
    try {
        const saved = localStorage.getItem('ai_todo_plan');
        if (saved) {
            currentPlan = JSON.parse(saved);
            renderPlan(currentPlan);
        }
    } catch (e) {
        console.error('Failed to load plan from localStorage:', e);
    }
}

function showLoading() {
    loadingSection.classList.remove('loadingHidden');
    generateBtn.disabled = true;
}

function hideLoading() {
    loadingSection.classList.add('loadingHidden');
    generateBtn.disabled = false;
}

function showError(msg) {
    errorText.textContent = msg;
    errorBox.classList.remove('errorHidden');
}

function hideError() {
    errorBox.classList.add('errorHidden');
}

loadPlan();