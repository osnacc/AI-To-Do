// Element references
const goalInput = document.getElementById('goalInput');
const generateBtn = document.getElementById('generateBtn');
const charCount = document.getElementById('charCount');
const loading = document.getElementById('loading');
const loadingText = document.getElementById('loadingText');
const errorBox = document.getElementById('errorBox');
const errorText = document.getElementById('errorText');
const dashboard = document.getElementById('dashboard');
const clearBar = document.getElementById('clearBar');
const clearBtn = document.getElementById('clearBtn');
const emptyState = document.getElementById('emptyState');
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
hideEmptyState();
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
    savePlan(data);
    showClearBar();
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
    void dashboard.offsetWidth;

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

    // Stats

    const stats = document.createElement('div');
    stats.className = 'planStats';

    const progressLabel = document.createElement('div');
    progressLabel.className = 'statsLabel';
    progressLabel.textContent = 'Progress';

    const progressCount = document.createElement('div');
    progressCount.className = 'statsCount';
    progressCount.id = 'statsCount';
    progressCount.textContent = `0 / ${data.tasks.length} tasks completed`;

    const progressBar = document.createElement('div');
    progressBar.className = 'progressBar';
    const progressFill = document.createElement('div');
    progressFill.className = 'progressFill';
    progressFill.id = 'progressFill';
    progressBar.appendChild(progressFill);

    const progressPercent = document.createElement('div');
    progressPercent.className = 'statsPercent';
    progressPercent.id = 'statsPercent';
    progressPercent.textContent = '0%';

    const timeRow = document.createElement('div');
    timeRow.className = 'statsRow';
    const timeLabel = document.createElement('span');
    timeLabel.className = 'statsRowLabel';
    timeLabel.textContent = 'Estimated time';
    const timeValue = document.createElement('span');
    timeValue.className = 'statsRowValue';
    timeValue.textContent = formatMinutes(
        data.tasks.reduce((sum, t) => sum + t.estimated_minutes, 0)
    );
    timeRow.appendChild(timeLabel);
    timeRow.appendChild(timeValue);
    
    const priorityRow = document.createElement('div');
    priorityRow.className = 'statsRow';
    const priorityLabel = document.createElement('span');
    priorityLabel.className = 'statsRowLabel';
    priorityLabel.textContent = 'Priorities';
    const priorityValue = document.createElement('span');
    priorityValue.className = 'statsRowValue';
    priorityValue.textContent = formatPriorities(data.tasks);
    priorityRow.appendChild(priorityLabel);
    priorityRow.appendChild(priorityValue);

    stats.appendChild(progressLabel);
    stats.appendChild(progressCount);
    stats.appendChild(progressBar);
    stats.appendChild(progressPercent);
    stats.appendChild(timeRow);
    stats.appendChild(priorityRow);

    dashboard.appendChild(stats);
    //Task list
    const list = document.createElement('div');
    list.className = 'taskList';

    data.tasks.forEach((task, index) => {
        const card = document.createElement('div');
        card.className = `taskCard priority-${task.priority}`;
        card.dataset.taskId = String(task.id);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'taskCheckbox';
        checkbox.addEventListener('change', () => {
            card.classList.toggle('taskCard--done', checkbox.checked);
            updateStats();
            persistCheckboxStates();
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
        card.style.animationDelay = `${(index * 40)}ms`;
    });

    dashboard.appendChild(list);
}

function formatMinutes(mins) {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function updateStats() {
    const cards = document.querySelectorAll('.taskCard');
    const total = cards.length;
    if (total === 0) return;

    let completed = 0;
    cards.forEach(card => {
        const cb = card.querySelector('.taskCheckbox');
        if(cb && cb.checked) completed += 1;
    });

    const percent = Math.round((completed / total) * 100);

    const countEl = document.getElementById('statsCount');
    const fillEl = document.getElementById('progressFill');
    const percentEl = document.getElementById('statsPercent');

    if(countEl) countEl.textContent = `${completed} / ${total} tasks completed`;
    if(fillEl) fillEl.style.width = `${percent}%`;
    if(percentEl) percentEl.textContent = `${percent}%`;
}

function formatPriorities(tasks) {
    const counts = { high: 0, medium: 0, low: 0 };
    tasks.forEach(t => {counts[t.priority] += 1; });
    return `High ${counts.high}   Medium ${counts.medium}   Low ${counts.low}`;
}

// LocalStorage

const STORAGE_KEY = 'aiToDoList.plan';

function savePlan(data) {
    try {
        const payload = { plan: data, checked: []};
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch(err){
        console.error('[AI To Do List] Failed to save plan:', err);
    }
}

function loadPlan(){
    try{
        const raw = localStorage.getItem(STORAGE_KEY);
        if(!raw)return null;
        return JSON.parse(raw);
    } catch(err) {
        console.error('[AI To Do List] Failed to load plan', err);
        return null;
    }
}

function clearPlan(){
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch(err){
        console.error('[AI To Do List] Failed to clear plan', err);
    }
}

function persistCheckboxStates(){
    const stored = loadPlan();
    if (!stored || !stored.plan) return;

    const checkedIds = [];
    document.querySelectorAll('.taskCard').forEach(card => {
        const cb = card.querySelector('.taskCheckbox');
        const id = Number(card.dataset.taskId);
        if(cb && cb.checked) checkedIds.push(id);
    });

    stored.checked = checkedIds;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch(err) {
        console.error('[AI To Do List] Failed to persist checkboxes', err);
    }
}

function restorePlan() {
    const stored = loadPlan();
    if(!stored || !stored.plan) return false;

    renderPlan(stored.plan);
    showDashboard();
    showClearBar();
    hideEmptyState();

    const checkedIds = new Set(stored.checked || []);
    document.querySelectorAll('.taskCard').forEach(card => {
        const id = Number(card.dataset.taskId);
        if(!checkedIds.has(id)) return;
        const cb = card.querySelector('.taskCheckbox');
        if(cb) {
            cb.checked = true;
            card.classList.add('taskCard--done');
        }
    });

    updateStats();
    return true;
}

function showClearBar(){
    clearBar.classList.remove('clearBarHidden');
}

function hideClearBar(){
    clearBar.classList.add('clearBarHidden');
}

function showEmptyState(){
    emptyState.classList.remove('emptyStateHidden');
}

function hideEmptyState(){
    emptyState.classList.add('emptyStateHidden');
}

// Events & init

clearBtn.addEventListener('click', () => {
    clearPlan();
    dashboard.innerHTML = '';
    hideDashboard();
    hideClearBar();
    hideError();
    showEmptyState();
    goalInput.value = '';
    charCount.textContent = '0 / 500';
});

restorePlan();

