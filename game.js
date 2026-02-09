const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size to window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game state
const player = {
    x: 400,
    y: 300,
    width: 32,
    height: 32,
    speed: 3,
    color: '#ff5722'
};

const professors = [
    {
        id: 'cs',
        name: 'Prof. Ada Code',
        x: 200,
        y: 150,
        width: 32,
        height: 32,
        color: '#2196f3',
        specialty: 'Computer Science',
        systemPrompt: 'You are Professor Ada Code, an enthusiastic computer science professor. You specialize in software engineering, algorithms, and AI. You love helping students understand the exciting world of programming and computational thinking. Be friendly, encouraging, and provide detailed information about CS programs, career paths, and what students can expect. Be honest and realistic - not every student is a perfect fit for CS. Mention challenges, required skills, and be candid about whether their background aligns with this field. If their interests seem better suited elsewhere, gently suggest they explore other options too. IMPORTANT: Respond in plain conversational text only. Do NOT use markdown formatting, bullet points, asterisks, or special formatting. Write naturally as if speaking in a casual conversation.'
    },
    {
        id: 'bio',
        name: 'Prof. Darwin Green',
        x: 600,
        y: 150,
        width: 32,
        height: 32,
        color: '#4caf50',
        specialty: 'Biology',
        systemPrompt: 'You are Professor Darwin Green, a passionate biology professor. You specialize in molecular biology, genetics, and ecology. You inspire students about the living world and research opportunities. Be warm, knowledgeable, and explain biology programs, research areas, and career opportunities in life sciences. Be honest and realistic - not every student is a perfect fit for Biology. Discuss the academic rigor, lab work requirements, and career realities. If their interests or strengths seem better aligned with other fields, kindly point that out. IMPORTANT: Respond in plain conversational text only. Do NOT use markdown formatting, bullet points, asterisks, or special formatting. Write naturally as if speaking in a casual conversation.'
    },
    {
        id: 'eng',
        name: 'Prof. Tesla Wright',
        x: 200,
        y: 450,
        width: 32,
        height: 32,
        color: '#ff9800',
        specialty: 'Engineering',
        systemPrompt: 'You are Professor Tesla Wright, a creative engineering professor. You specialize in mechanical, electrical, and civil engineering. You love innovation and problem-solving. Be enthusiastic, practical, and share insights about engineering programs, hands-on projects, and engineering careers. Be honest and realistic - engineering is demanding and not for everyone. Discuss the heavy math and physics requirements, long study hours, and whether their profile truly fits. If their skills or interests point elsewhere, suggest they consider other paths. IMPORTANT: Respond in plain conversational text only. Do NOT use markdown formatting, bullet points, asterisks, or special formatting. Write naturally as if speaking in a casual conversation.'
    },
    {
        id: 'arts',
        name: 'Prof. Monet Canvas',
        x: 600,
        y: 450,
        width: 32,
        height: 32,
        color: '#e91e63',
        specialty: 'Fine Arts',
        systemPrompt: 'You are Professor Monet Canvas, an inspiring fine arts professor. You specialize in visual arts, design, and creative expression. You believe in the power of creativity and artistic exploration. Be imaginative, supportive, and discuss arts programs, portfolio development, and creative careers. Be honest and realistic - art careers can be challenging and financially uncertain. Discuss portfolio requirements, competition, and whether their interests truly align with fine arts. If they seem more analytical or practical-minded, suggest they might find better fit in other fields. IMPORTANT: Respond in plain conversational text only. Do NOT use markdown formatting, bullet points, asterisks, or special formatting. Write naturally as if speaking in a casual conversation.'
    }
];

// Input handling
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;

    if (e.key === ' ') {
        checkProfessorInteraction();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Check if player can interact with a professor
function checkProfessorInteraction() {
    for (const prof of professors) {
        const distance = Math.sqrt(
            Math.pow(player.x - prof.x, 2) +
            Math.pow(player.y - prof.y, 2)
        );

        if (distance < 60) {
            openDialog(prof);
            return;
        }
    }
}

// User profile management
let userProfile = {
    name: '',
    cv: '',
    favoriteSubjects: '',
    careerGoals: '',
    learningStyle: ''
};

// Conversation history per professor
const conversationHistory = {
    cs: [],
    bio: [],
    eng: [],
    arts: []
};

// Certifications and skill tree
let certifications = [];

function loadCertifications() {
    const saved = localStorage.getItem('studyVillageCertifications');
    if (saved) {
        certifications = JSON.parse(saved);
        renderCertifications();
        renderSkillTree();
    }
}

function saveCertifications() {
    localStorage.setItem('studyVillageCertifications', JSON.stringify(certifications));
}

// Load profile from localStorage
function loadProfile() {
    const saved = localStorage.getItem('studyVillageProfile');
    if (saved) {
        userProfile = JSON.parse(saved);
        updateProfileUI();
    }
}

// Save profile to localStorage
function saveProfile() {
    localStorage.setItem('studyVillageProfile', JSON.stringify(userProfile));
}

// Update profile UI with saved data
function updateProfileUI() {
    document.getElementById('user-name').value = userProfile.name || '';
    document.getElementById('user-cv').value = userProfile.cv || '';
    document.getElementById('favorite-subjects').value = userProfile.favoriteSubjects || '';
    document.getElementById('career-goals').value = userProfile.careerGoals || '';
    document.getElementById('learning-style').value = userProfile.learningStyle || '';
}

// Profile modal management
const profileBtn = document.getElementById('profile-btn');
const profileModal = document.getElementById('profile-modal');
const closeProfileBtn = document.getElementById('close-profile');
const saveProfileBtn = document.getElementById('save-profile');
const profileSavedMsg = document.getElementById('profile-saved-msg');

profileBtn.addEventListener('click', () => {
    profileModal.classList.remove('hidden');
});

closeProfileBtn.addEventListener('click', () => {
    profileModal.classList.add('hidden');
    profileSavedMsg.classList.add('hidden');
});

saveProfileBtn.addEventListener('click', () => {
    userProfile.name = document.getElementById('user-name').value;
    userProfile.cv = document.getElementById('user-cv').value;
    userProfile.favoriteSubjects = document.getElementById('favorite-subjects').value;
    userProfile.careerGoals = document.getElementById('career-goals').value;
    userProfile.learningStyle = document.getElementById('learning-style').value;

    saveProfile();

    profileSavedMsg.classList.remove('hidden');
    setTimeout(() => {
        profileSavedMsg.classList.add('hidden');
    }, 3000);
});

// Press 'P' to open profile
window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'p' && !profileModal.classList.contains('hidden') === false && dialogBox.classList.contains('hidden')) {
        profileModal.classList.remove('hidden');
    }
});

// Dialog management
let currentProfessor = null;
const dialogBox = document.getElementById('dialog-box');
const professorNameEl = document.getElementById('professor-name');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const closeBtn = document.getElementById('close-dialog');

function openDialog(professor) {
    currentProfessor = professor;
    professorNameEl.textContent = `${professor.name} - ${professor.specialty}`;
    chatMessages.innerHTML = '';

    // Restore conversation history for this professor
    const history = conversationHistory[professor.id] || [];
    if (history.length > 0) {
        history.forEach(msg => {
            addMessage(msg.role === 'user' ? 'user' : 'professor', msg.content);
        });
    } else {
        // Add welcome message only on first conversation
        const welcomeMsg = `Hello${userProfile.name ? ' ' + userProfile.name : ''}! I'm ${professor.name}. I'd be happy to tell you about ${professor.specialty} programs and answer any questions you have about this field of study!`;
        addMessage('professor', welcomeMsg);
        conversationHistory[professor.id].push({ role: 'assistant', content: welcomeMsg });
    }

    dialogBox.classList.remove('hidden');
    userInput.focus();
}

function closeDialog() {
    dialogBox.classList.add('hidden');
    currentProfessor = null;
    userInput.value = '';
}

closeBtn.addEventListener('click', closeDialog);

function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;

    const senderDiv = document.createElement('div');
    senderDiv.className = 'sender';
    senderDiv.textContent = sender === 'user' ? 'You' : currentProfessor.name;

    const textDiv = document.createElement('div');
    textDiv.className = 'text';
    textDiv.textContent = text;

    messageDiv.appendChild(senderDiv);
    messageDiv.appendChild(textDiv);
    chatMessages.appendChild(messageDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message || !currentProfessor) return;

    addMessage('user', message);
    userInput.value = '';

    // Add to conversation history
    conversationHistory[currentProfessor.id].push({ role: 'user', content: message });

    // Show loading state
    sendBtn.disabled = true;
    sendBtn.textContent = 'Thinking...';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                professorId: currentProfessor.id,
                message: message,
                systemPrompt: currentProfessor.systemPrompt,
                userProfile: userProfile,
                conversationHistory: conversationHistory[currentProfessor.id]
            })
        });

        const data = await response.json();
        addMessage('professor', data.response);

        // Add assistant response to history
        conversationHistory[currentProfessor.id].push({ role: 'assistant', content: data.response });
    } catch (error) {
        addMessage('professor', 'Sorry, I seem to be having trouble responding right now. Please try again!');
        console.error('Chat error:', error);
    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send';
        userInput.focus();
    }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Update player position
function updatePlayer() {
    if (keys['arrowup'] || keys['w']) {
        player.y = Math.max(0, player.y - player.speed);
    }
    if (keys['arrowdown'] || keys['s']) {
        player.y = Math.min(canvas.height - player.height, player.y + player.speed);
    }
    if (keys['arrowleft'] || keys['a']) {
        player.x = Math.max(0, player.x - player.speed);
    }
    if (keys['arrowright'] || keys['d']) {
        player.x = Math.min(canvas.width - player.width, player.x + player.speed);
    }
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.fillStyle = '#8bc34a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid pattern
    ctx.strokeStyle = '#7cb342';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    // Draw professors
    professors.forEach(prof => {
        // Draw shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(prof.x + 2, prof.y + prof.height + 2, prof.width, 4);

        // Draw professor
        ctx.fillStyle = prof.color;
        ctx.fillRect(prof.x, prof.y, prof.width, prof.height);

        // Draw face
        ctx.fillStyle = '#ffe0bd';
        ctx.fillRect(prof.x + 8, prof.y + 8, 16, 16);

        // Draw eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(prof.x + 10, prof.y + 12, 3, 3);
        ctx.fillRect(prof.x + 19, prof.y + 12, 3, 3);

        // Draw name tag
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(prof.x - 10, prof.y - 20, prof.width + 20, 16);
        ctx.fillStyle = '#fff';
        ctx.font = '10px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(prof.specialty, prof.x + prof.width/2, prof.y - 9);

        // Draw interaction radius if player is near
        const distance = Math.sqrt(
            Math.pow(player.x - prof.x, 2) +
            Math.pow(player.y - prof.y, 2)
        );
        if (distance < 60) {
            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(prof.x + prof.width/2, prof.y + prof.height/2, 60, 0, Math.PI * 2);
            ctx.stroke();

            // Draw "Press SPACE" indicator
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.fillRect(prof.x - 20, prof.y + prof.height + 10, prof.width + 40, 16);
            ctx.fillStyle = '#000';
            ctx.font = 'bold 10px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText('Press SPACE', prof.x + prof.width/2, prof.y + prof.height + 21);
        }
    });

    // Draw player
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(player.x + 2, player.y + player.height + 2, player.width, 4);

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw player face
    ctx.fillStyle = '#ffe0bd';
    ctx.fillRect(player.x + 8, player.y + 8, 16, 16);

    // Draw eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(player.x + 10, player.y + 12, 3, 3);
    ctx.fillRect(player.x + 19, player.y + 12, 3, 3);

    // Draw smile
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(player.x + 16, player.y + 18, 4, 0, Math.PI);
    ctx.stroke();
}

// Game loop
function gameLoop() {
    updatePlayer();
    draw();
    requestAnimationFrame(gameLoop);
}

// Initialize
loadProfile();
gameLoop();
