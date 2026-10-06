// ==============================
// 1. DISCO LIGHT SPARKLE BURSTS
// ==============================
function createDiscoSparkle() {
    const container = document.getElementById('disco-sparkles-container');
    if (!container) return;

    const sparkle = document.createElement('span');
    const colors = ['#ff2d92', '#00e5ff', '#dfff00', '#ffffff', '#b026ff'];
    sparkle.className = 'disco-sparkle';
    sparkle.style.left = `${Math.random() * 92 + 2}%`;
    sparkle.style.top = `${Math.random() * 92 + 2}%`;
    sparkle.style.setProperty('--sparkle-color', colors[Math.floor(Math.random() * colors.length)]);
    sparkle.style.animationDuration = `${0.25 + Math.random() * 0.2}s`;
    container.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 600);
}

// ==============================
// 2. IMAGE BUBBLE SPAM GENERATOR (Runs on load)
// ==============================
function spawnBubble() {
    const imgSrc = "https://i.ibb.co/zhvjvnmb/Whats-App-Image-2026-09-26-at-6-54-01-PM.jpg";
    const wrapper = document.createElement('div');
    wrapper.className = 'bubble-wrapper';
    const size = Math.random() * 70 + 50;
    wrapper.style.width = size + 'px';
    wrapper.style.height = size + 'px';
    wrapper.style.left = (Math.random() * 90 + 5) + 'vw';
    const duration = Math.random() * 4 + 4;
    wrapper.style.animationDuration = duration + 's';

    const img = document.createElement('img');
    img.src = imgSrc;
    img.className = 'bubble-img';
    img.style.animationDuration = (Math.random() * 2 + 2) + 's';

    wrapper.appendChild(img);
    document.body.appendChild(wrapper);
    setTimeout(() => { wrapper.remove(); }, duration * 1000);
}

// Trigger animations when page loads
window.addEventListener('load', () => {
    // Bubble Spam logic
    let bubbleCount = 0;
    const maxBubbles = 30;
    const bubbleInterval = setInterval(() => {
        spawnBubble();
        bubbleCount++;
        if (bubbleCount >= maxBubbles) clearInterval(bubbleInterval);
    }, 150);

    // Keep the photo alive with short, colorful disco sparkle bursts.
    setInterval(createDiscoSparkle, 65);
});

// ==============================
// 3. HERO TYPING ANIMATION
// ==============================
const terminalEl = document.getElementById('hero-terminal');
const heroName = document.getElementById('hero-name');
const heroTagline = document.getElementById('hero-tagline');

const lines = [
    { type: 'command', text: 'whoami' },
    { type: 'output', text: 'darsh dhawan' },
    { type: 'output', text: 'linux & networking administration' },
    { type: 'command', text: 'status --check' },
    { type: 'output', text: 'home-lab: ACTIVE | services: RUNNING | caffeine: CRITICAL' },
];

let lineIndex = 0, charIndex = 0, currentLineEl = null;

function typeLine() {
    if (lineIndex >= lines.length) {
        heroName.classList.add('visible');
        setTimeout(() => heroTagline.classList.add('visible'), 300);
        return;
    }
    const line = lines[lineIndex];
    if (charIndex === 0) {
        currentLineEl = document.createElement('span');
        currentLineEl.classList.add('terminal-line');
        terminalEl.appendChild(currentLineEl);
        if (line.type === 'command') {
            const p = document.createElement('span'); p.classList.add('prompt'); p.textContent = '$ ';
            currentLineEl.appendChild(p);
        }
        const span = document.createElement('span');
        span.classList.add(line.type === 'command' ? 'command' : 'output');
        span.id = 'typing-target';
        currentLineEl.appendChild(span);
        currentLineEl.classList.add('visible');
    }
    const target = document.getElementById('typing-target');
    if (!target) return;
    if (charIndex < line.text.length) {
        target.textContent += line.text[charIndex];
        charIndex++;
        setTimeout(typeLine, line.type === 'command' ? 20 + Math.random() * 20 : 10 + Math.random() * 10);
    } else {
        target.removeAttribute('id');
        lineIndex++; charIndex = 0;
        setTimeout(typeLine, line.type === 'command' ? 120 : 60);
    }
}
setTimeout(typeLine, 800);

// ==============================
// 4. MISCELLANEOUS SETUP
// ==============================
setTimeout(() => { const s = document.getElementById('scan-line'); if (s) s.remove(); }, 2000);

function lightModeJoke() {
    const m = ['No.','Absolutely not.','This is a dark place. Literally.','Light mode? In THIS economy?','Error: sanity check failed.',"I don't think so, chief."];
    alert(m[Math.floor(Math.random() * m.length)]);
}

// ==============================
// 5. SIMPLE INTERACTIVE TERMINAL
// ==============================
const terminalInput = document.getElementById('terminal-input');
const terminalBody = document.getElementById('hero-terminal');

terminalInput.addEventListener('keydown', async (event) => {
    if (event.key !== 'Enter') return;

    const command = terminalInput.value.trim();
    if (!command) return;

    // Show the command in the terminal.
    const line = document.createElement('div');
    line.innerHTML = '<span class="prompt">$ </span>';
    const text = document.createElement('span');
    text.textContent = command;
    line.appendChild(text);
    terminalBody.appendChild(line);

    terminalInput.value = '';

    // Save it to PostgreSQL through PHP.
    try {
        const response = await fetch('/api/terminal.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: command })
        });

        if (!response.ok) throw new Error('Server error');
    } catch (error) {
        console.error('Could not save terminal input:', error);
    }

    terminalInput.focus();
});
