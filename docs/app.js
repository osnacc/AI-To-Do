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
    loading.classList.add('loadingHidden')
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
generateBtn.addEventListener('click', () => {
const goal = goalInput.value.trim();
if (!goal){
    showError('Please describe what you want to accomplish.');
    return;
}

hideError();

// Simulated loading state - will be changed with real fetch to  /api/generate.
showLoading();
loadingText.textContent = 'Analyzing your goal...';

setTimeout(() => {
    hideLoading();
    console.log('[AI To Do List Goal submitted:',goal);
    alert('Wiring works. Backend will be connected in the next step.');
}, 800);
});