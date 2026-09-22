// Element references
const goalInput = document.getElementById('goalInput');
const generateBtn = document.getElementById('generateBtn');
const charCount = document.getElementById('charCount');
const loading = document.getElementById('loading');
const loadingText = document.getElementById('loadingText');
const errorBox = document.getElementById('errorBox');
const errorText = document.getElementById('errorText');
const dashboard = document.getElementById('dashboard');


// UI helpers

function showLoading() {
    loading.classList.remove('loadingHidden');
}

function hideLoading() {
    loading.classList.add('loadingHidden');
}

function showError(message) {
    errorText.textContent = message ; 
    errorBox.classList.remove('errorHidden');
} 

function hideError() {
    errorBox.classList.add('errorHidden');
}

function showDashboard() {
    dashboard.classList.remove('dashboardHidden');
}

function hideDashboard() {
    dashboard.classList.add('dashboardHidden');
}


// Character counter

goalInput.addEventListener('input',() => {
    charCount.textContent = `${goalInput.value.length} / 500`;
});

// Generate button (placeholder)
generateBtn.addEventListener('click', async () => {
const goal = goalInput.value.trim();
if (!goal){
    showError('Please describe what you want to accomplish.');
    return;
}

hideError();
showLoading();
loadingText.textContent = 'Analyzing your goal...';
generateBtn.disabled = true;

try {
    const API_BASE = window.location.hostname === 'localhost'
  ? ''
  : 'https://ai-to-do-list-backend.onrender.com';

const response = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ goal })
    });
    const data = await response.json();

    if(!response.ok) {
        throw new Error(data.error || 'Request failed');
    }

    renderPlan(data);
    showDashboard();
}catch (err){
    console.error('[AI To Do List] Error:', err);
    showError(err.message || 'Something went wrong. Please try again.');
} finally {
    hideLoading();
    generateBtn.disabled = false;
}
});

// Rendering

function renderPlan(data) {
    dashboard.innerHTML = '';

    //Header
    const header = document.createElement('div');
    header.className = 'planHeader';

    const title = document.createElement('h2');
    title.className = 'planTitle';
    title.textContent = data.goal;

    const summary = document.createElement('p');
    summary.className = 'planSummary';
    summary.textContent = data.summary;

    header.appendChild(title);
    header.appendChild(summary);
    dashboard.appendChild(header);

    //Task list
    const list = document.createElement('div');
    list.className = 'taskList';

    data.tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = `taskCard priority-${task.priority}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'taskCheckbox';
        checkbox.addEventListener('change', () => {
            card.classList.toggle('taskCard--done', checkbox.checked);
        });

        const body = document.createElement('div');
        body.className = 'taskBody';

        const titleEl = document.createElement('h3');
        titleEl.className = 'taskTitle';
        titleEl.textContent = task.title;

        const descEl = document.createElement('p');
        descEl.className = 'taskDescription';
        descEl.textContent = task.description;

        const meta = document.createElement('div');
        meta.className = 'taskMeta';

        const priorityBadge = document.createElement('span');
        priorityBadge.className = `taskPriority priority-${task.priority}`;
        priorityBadge.textContent = task.priority.toUpperCase();

        const timeBadge = document.createElement('span');
        timeBadge.className = 'taskTime';
        timeBadge.textContent = formatMinutes(task.estimated_minutes);

        meta.appendChild(priorityBadge);
        meta.appendChild(timeBadge);

        body.appendChild(titleEl);
        body.appendChild(descEl);
        body.appendChild(meta);

        card.appendChild(checkbox);
        card.appendChild(body);
        list.appendChild(card);
    });

    dashboard.appendChild(list);
}

function formatMinutes(mins) {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

