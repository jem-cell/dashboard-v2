const WORK_START_HOUR = 9;
const WORK_END_HOUR = 17;

const bookmarks = {
    work: [
        {
            category: 'Google Workspace',
            items: [
                { title: 'Gmail', desc: 'Email', icon: 'G', url: 'https://mail.google.com' },
                { title: 'Google Calendar', desc: 'Meetings & scheduling', icon: 'Cal', url: 'https://calendar.google.com' },
                { title: 'Google Sheets', desc: 'Spreadsheets & data', icon: 'S', url: 'https://docs.google.com/spreadsheets' },
                { title: 'Google Docs', desc: 'Documents', icon: 'D', url: 'https://docs.google.com/document' },
                { title: 'Google Forms', desc: 'Forms', icon: 'F', url: 'https://docs.google.com/forms' },
                { title: 'Shared Drive', desc: 'Team storage', icon: 'SD', url: 'https://drive.google.com/drive/u/0/folders/0AAZUVdPYQtvyUk9PVA' },
                { title: 'Looker Studio', desc: 'Dashboards & reporting', icon: 'Look', url: 'https://lookerstudio.google.com' }
            ]
        },
        {
            category: 'Automation',
            items: [
                { title: 'OpenAI API Dashboard', desc: 'AI & model management', icon: 'AI', url: 'https://platform.openai.com' },
                { title: 'Make.com', desc: 'Workflow automation', icon: 'Mk', url: 'https://www.make.com' }
            ]
        },
        {
            category: 'Analytics & Collaboration',
            items: [
                { title: 'Lucidchart', desc: 'Diagrams & flowcharts', icon: 'Lc', url: 'https://lucid.app' },
                { title: 'Dropbox', desc: 'File storage', icon: 'DB', url: 'https://www.dropbox.com' },
                { title: 'Slack', desc: 'Team communication', icon: 'S', url: 'https://slack.com' },
                { title: 'NIRA', desc: 'File storage', icon: 'NR', url: 'https://nira.com' }
            ]
        },
        {
            category: 'Social Media',
            items: [
                { title: 'Instagram', desc: 'Content & engagement', icon: 'IG', url: 'https://www.instagram.com/surveyair/' },
                { title: 'LinkedIn', desc: 'Networking', icon: 'in', url: 'https://www.linkedin.com/company/survey-air' },
                { title: 'YouTube', desc: 'Video content', icon: 'YT', url: 'https://www.youtube.com/@surveyair' }
            ]
        }
    ],
    personal: [
        {
            category: 'Entertainment',
            items: [
                { title: 'YouTube', desc: 'Video streaming', url: 'https://youtube.com', icon: '📺' },
                { title: 'Netflix', desc: 'Movies & TV', url: 'https://netflix.com', icon: '🍿' }
            ]
        },
        {
            category: 'Social',
            items: [
                { title: 'Reddit', desc: 'Community', url: 'https://reddit.com', icon: '👽' },
                { title: 'Twitter', desc: 'News & updates', url: 'https://twitter.com', icon: '🐦' }
            ]
        },
        {
            category: 'Tools',
            items: [
                { title: 'Spotify', desc: 'Music', url: 'https://spotify.com', icon: '🎵' },
                { title: 'Amazon', desc: 'Shopping', url: 'https://amazon.com', icon: '🛒' }
            ]
        }
    ]
};

const clockEl = document.getElementById('clock');
const greetingEl = document.getElementById('greeting');
const modeIndicatorEl = document.getElementById('mode-indicator');
const bookmarksGridEl = document.getElementById('bookmarks-grid');
const debugTimeInput = document.getElementById('debug-time');
const resetTimeBtn = document.getElementById('reset-time');
const debugMenuBtn = document.getElementById('debug-menu-btn');
const debugControls = document.getElementById('debug-controls');

let debugTimeOffset = null;

// Debug Menu Toggle
debugMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    debugControls.classList.toggle('visible');
    debugMenuBtn.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!debugControls.contains(e.target) && !debugMenuBtn.contains(e.target)) {
        debugControls.classList.remove('visible');
        debugMenuBtn.classList.remove('active');
    }
});

function getCurrentTime() {
    if (debugTimeOffset !== null) {
        return new Date(Date.now() + debugTimeOffset);
    }
    return new Date();
}

function updateDashboard() {
    const now = getCurrentTime();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Update Clock
    clockEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    // Determine Mode
    const isWorkMode = hours >= WORK_START_HOUR && hours < WORK_END_HOUR;

    // Update Theme & Content
    if (isWorkMode) {
        document.documentElement.removeAttribute('data-theme');
        modeIndicatorEl.textContent = 'Work Mode';
        greetingEl.textContent = 'Time to Focus';
        renderBookmarks(bookmarks.work);
    } else {
        document.documentElement.setAttribute('data-theme', 'personal');
        modeIndicatorEl.textContent = 'Personal Mode';
        greetingEl.textContent = 'Time to Relax';
        renderBookmarks(bookmarks.personal);
    }
}

function renderBookmarks(categories) {
    // If the data is flat (old personal array structure fallback), wrap it
    if (categories.length > 0 && !categories[0].category) {
        categories = [{ category: 'Bookmarks', items: categories }];
    }

    bookmarksGridEl.innerHTML = categories.map(cat => `
        <div class="category-section">
            <h2 class="category-title">${cat.category}</h2>
            <div class="items-grid">
                ${cat.items.map(item => `
                    <a href="${item.url}" class="bookmark-card" target="_blank">
                        <div class="bookmark-icon-text">${item.icon}</div>
                        <div class="bookmark-details">
                            <div class="bookmark-title">${item.title}</div>
                            <div class="bookmark-desc">${item.desc || ''}</div>
                        </div>
                    </a>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Debug Controls
debugTimeInput.addEventListener('change', (e) => {
    if (!e.target.value) return;
    const [h, m] = e.target.value.split(':').map(Number);
    const now = new Date();
    const debugDate = new Date();
    debugDate.setHours(h, m, 0, 0);

    debugTimeOffset = debugDate.getTime() - now.getTime();
    updateDashboard();
});

resetTimeBtn.addEventListener('click', () => {
    debugTimeOffset = null;
    debugTimeInput.value = '';
    updateDashboard();
});

// Initial Run & Interval
updateDashboard();
setInterval(updateDashboard, 1000);
