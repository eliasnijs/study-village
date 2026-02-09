const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size to window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Camera offset for following player
const camera = {
    x: 0,
    y: 0
};

// Game state
const player = {
    x: 700,  // Start in center
    y: 260,
    width: 32,
    height: 32,
    speed: 3,
    color: '#ff5722'
};

// World size
const world = {
    width: 1600,
    height: 800
};

// Generate static flower positions once
const flowers = [];
for (let i = 0; i < 30; i++) {
    const x = Math.random() * world.width;
    const y = Math.random() * world.height;
    // Avoid roads
    if ((y < 235 || y > 325) && (x < 255 || x > 325) && (x < 1105 || x > 1175)) {
        flowers.push({
            x: x,
            y: y,
            color: ['#e91e63', '#9c27b0', '#ff5722', '#ffeb3b'][Math.floor(Math.random() * 4)]
        });
    }
}

// Professor cluster (left side - Academic Center)
const professors = [
    {
        id: 'cs',
        name: 'Prof. Ada Code',
        x: 200,
        y: 200,
        width: 32,
        height: 32,
        color: '#2196f3',
        specialty: 'Computer Science',
        type: 'professor',
        systemPrompt: 'You are Professor Ada Code, an enthusiastic computer science professor. You specialize in software engineering, algorithms, and AI. You love helping students understand the exciting world of programming and computational thinking. Be friendly, encouraging, and provide detailed information about CS programs, career paths, and what students can expect. Be honest and realistic - not every student is a perfect fit for CS. Mention challenges, required skills, and be candid about whether their background aligns with this field. If their interests seem better suited elsewhere, gently suggest they explore other options too. IMPORTANT: Respond in plain conversational text only. Do NOT use markdown formatting, bullet points, asterisks, or special formatting. Write naturally as if speaking in a casual conversation.'
    },
    {
        id: 'bio',
        name: 'Prof. Darwin Green',
        x: 350,
        y: 200,
        width: 32,
        height: 32,
        color: '#4caf50',
        specialty: 'Biology',
        type: 'professor',
        systemPrompt: 'You are Professor Darwin Green, a passionate biology professor. You specialize in molecular biology, genetics, and ecology. You inspire students about the living world and research opportunities. Be warm, knowledgeable, and explain biology programs, research areas, and career opportunities in life sciences. Be honest and realistic - not every student is a perfect fit for Biology. Discuss the academic rigor, lab work requirements, and career realities. If their interests or strengths seem better aligned with other fields, kindly point that out. IMPORTANT: Respond in plain conversational text only. Do NOT use markdown formatting, bullet points, asterisks, or special formatting. Write naturally as if speaking in a casual conversation.'
    },
    {
        id: 'eng',
        name: 'Prof. Tesla Wright',
        x: 200,
        y: 320,
        width: 32,
        height: 32,
        color: '#ff9800',
        specialty: 'Engineering',
        type: 'professor',
        systemPrompt: 'You are Professor Tesla Wright, a creative engineering professor. You specialize in mechanical, electrical, and civil engineering. You love innovation and problem-solving. Be enthusiastic, practical, and share insights about engineering programs, hands-on projects, and engineering careers. Be honest and realistic - engineering is demanding and not for everyone. Discuss the heavy math and physics requirements, long study hours, and whether their profile truly fits. If their skills or interests point elsewhere, suggest they consider other paths. IMPORTANT: Respond in plain conversational text only. Do NOT use markdown formatting, bullet points, asterisks, or special formatting. Write naturally as if speaking in a casual conversation.'
    },
    {
        id: 'arts',
        name: 'Prof. Monet Canvas',
        x: 350,
        y: 320,
        width: 32,
        height: 32,
        color: '#e91e63',
        specialty: 'Fine Arts',
        type: 'professor',
        systemPrompt: 'You are Professor Monet Canvas, an inspiring fine arts professor. You specialize in visual arts, design, and creative expression. You believe in the power of creativity and artistic exploration. Be imaginative, supportive, and discuss arts programs, portfolio development, and creative careers. Be honest and realistic - art careers can be challenging and financially uncertain. Discuss portfolio requirements, competition, and whether their interests truly align with fine arts. If they seem more analytical or practical-minded, suggest they might find better fit in other fields. IMPORTANT: Respond in plain conversational text only. Do NOT use markdown formatting, bullet points, asterisks, or special formatting. Write naturally as if speaking in a casual conversation.'
    }
];

// University cluster (right side - University Row)
const universities = [
    {
        id: 'kuleuven',
        name: 'KU Leuven',
        x: 1050,
        y: 150,
        width: 56,
        height: 56,
        color: '#1e3a8a',
        specialty: 'KU Leuven - Catholic University of Leuven',
        location: 'Leuven, Belgium',
        type: 'university',
        systemPrompt: 'You are an admissions counselor for KU Leuven (Katholieke Universiteit Leuven) located in Leuven, Belgium. You provide detailed information about admission requirements, application process, deadlines, programs offered, campus life, and tuition. KU Leuven is one of Europe\'s top universities. Programs: Engineering, Medicine, Sciences, Law, Economics, Humanities. Admission: Secondary school diploma, entrance exams for some programs (like Medicine), language requirements (Dutch for most programs, some English-taught masters). Application deadline: Usually March 1st for September start. Tuition: Around €950 per year for EU students. Be professional and explain the Belgian university system. IMPORTANT: Respond in plain conversational text only. Do NOT use markdown formatting, bullet points, asterisks, or special formatting. Write naturally as if speaking in a casual conversation.'
    },
    {
        id: 'ugent',
        name: 'UGent',
        x: 1200,
        y: 150,
        width: 56,
        height: 56,
        color: '#1e40af',
        specialty: 'Ghent University',
        location: 'Ghent, Belgium',
        type: 'university',
        systemPrompt: 'You are an admissions counselor for Ghent University (Universiteit Gent / UGent) located in Ghent, Belgium. You provide detailed information about admission requirements, application process, deadlines, programs, campus culture, and tuition. UGent is a top Belgian university known for sciences and engineering. Programs: Engineering, Sciences, Medicine, Bioscience Engineering, Economics, Humanities. Admission: Secondary school diploma, entrance exam for some programs, language requirements. Application deadline: March for September start. Tuition: Around €950 per year for EU students. Explain the differences between university and hogeschool. Be informative and honest about program difficulty. IMPORTANT: Respond in plain conversational text only. Do NOT use markdown formatting, bullet points, asterisks, or special formatting. Write naturally as if speaking in a casual conversation.'
    },
    {
        id: 'howest',
        name: 'Howest',
        x: 1050,
        y: 300,
        width: 56,
        height: 56,
        color: '#dc2626',
        specialty: 'Hogeschool West-Vlaanderen',
        location: 'Kortrijk & Bruges, Belgium',
        type: 'hogeschool',
        systemPrompt: 'You are an admissions counselor for Howest (Hogeschool West-Vlaanderen) with campuses in Kortrijk and Bruges, Belgium. You provide information about admission requirements, application process, programs, and practical training. Howest is a hogeschool (university of applied sciences) focused on practical, professional education. Programs: Applied Computer Science (DAE - Digital Arts & Entertainment is famous), Communication, Business, Healthcare, Applied Engineering. Admission: Secondary school diploma, portfolio for creative programs. Application deadline: Flexible, usually until August for September start. Tuition: Around €950 per year for EU students. Explain that hogeschool focuses on hands-on skills and internships, while universities focus on theory and research. IMPORTANT: Respond in plain conversational text only. Do NOT use markdown formatting, bullet points, asterisks, or special formatting. Write naturally as if speaking in a casual conversation.'
    },
    {
        id: 'thomasmore',
        name: 'Thomas More',
        x: 1200,
        y: 300,
        width: 56,
        height: 56,
        color: '#059669',
        specialty: 'Thomas More Hogeschool',
        location: 'Antwerp & Mechelen, Belgium',
        type: 'hogeschool',
        systemPrompt: 'You are an admissions counselor for Thomas More Hogeschool with campuses in Antwerp, Mechelen, and other cities in Belgium. You provide information about admission requirements, application process, programs, and career preparation. Thomas More is a hogeschool offering practical, professional bachelor programs. Programs: Applied Computer Science, Business Management, Communication, Education, Healthcare, Industrial Engineering. Admission: Secondary school diploma, some programs have additional requirements. Application deadline: Flexible enrollment, usually until late summer. Tuition: Around €950 per year for EU students. Emphasize the practical approach, internships, and strong connections with industry. Explain hogeschool vs university differences. IMPORTANT: Respond in plain conversational text only. Do NOT use markdown formatting, bullet points, asterisks, or special formatting. Write naturally as if speaking in a casual conversation.'
    }
];

const npcs = [...professors, ...universities];

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

// Check if player can interact with an NPC
function checkProfessorInteraction() {
    for (const npc of npcs) {
        const distance = Math.sqrt(
            Math.pow(player.x - npc.x, 2) +
            Math.pow(player.y - npc.y, 2)
        );

        const interactRadius = npc.type === 'university' ? 80 : 60;
        if (distance < interactRadius) {
            openDialog(npc);
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

// Conversation history per NPC
const conversationHistory = {
    cs: [],
    bio: [],
    eng: [],
    arts: [],
    kuleuven: [],
    ugent: [],
    howest: [],
    thomasmore: []
};

// Certifications and skill tree
let certifications = [];
let goalSkills = [];

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

function loadGoalSkills() {
    const saved = localStorage.getItem('studyVillageGoalSkills');
    if (saved) {
        goalSkills = JSON.parse(saved);
        renderGoalSkills();
    }
}

function saveGoalSkills() {
    localStorage.setItem('studyVillageGoalSkills', JSON.stringify(goalSkills));
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

function openDialog(npc) {
    currentProfessor = npc;
    professorNameEl.textContent = `${npc.name} - ${npc.specialty}`;
    chatMessages.innerHTML = '';

    // Restore conversation history for this NPC
    const history = conversationHistory[npc.id] || [];
    if (history.length > 0) {
        history.forEach(msg => {
            addMessage(msg.role === 'user' ? 'user' : 'professor', msg.content);
        });
    } else {
        // Add welcome message only on first conversation
        let welcomeMsg;
        if (npc.type === 'university') {
            welcomeMsg = `Welcome${userProfile.name ? ', ' + userProfile.name : ''}! I'm an admissions counselor for ${npc.specialty}. I can help you understand our admission requirements, application process, programs, and answer any questions about applying to our university!`;
        } else {
            welcomeMsg = `Hello${userProfile.name ? ' ' + userProfile.name : ''}! I'm ${npc.name}. I'd be happy to tell you about ${npc.specialty} programs and answer any questions you have about this field of study!`;
        }
        addMessage('professor', welcomeMsg);
        conversationHistory[npc.id].push({ role: 'assistant', content: welcomeMsg });
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
                conversationHistory: conversationHistory[currentProfessor.id],
                certifications: certifications,
                goalSkills: goalSkills
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
        player.y = Math.min(world.height - player.height, player.y + player.speed);
    }
    if (keys['arrowleft'] || keys['a']) {
        player.x = Math.max(0, player.x - player.speed);
    }
    if (keys['arrowright'] || keys['d']) {
        player.x = Math.min(world.width - player.width, player.x + player.speed);
    }
}

// Update camera to follow player
function updateCamera() {
    // Center camera on player
    camera.x = player.x - canvas.width / 2 + player.width / 2;
    camera.y = player.y - canvas.height / 2 + player.height / 2;

    // Clamp camera to world bounds
    camera.x = Math.max(0, Math.min(world.width - canvas.width, camera.x));
    camera.y = Math.max(0, Math.min(world.height - canvas.height, camera.y));
}

// Draw everything
function draw() {
    // Save context state
    ctx.save();

    // Apply camera transform
    ctx.translate(-camera.x, -camera.y);

    // Clear canvas - grass background
    ctx.fillStyle = '#6fa352';
    ctx.fillRect(0, 0, world.width, world.height);

    // Draw grass pattern
    ctx.fillStyle = '#7cb342';
    for (let i = 0; i < world.width; i += 20) {
        for (let j = 0; j < world.height; j += 20) {
            if (Math.random() > 0.7) {
                ctx.fillRect(i, j, 2, 2);
            }
        }
    }

    // Draw roads/paths
    // Main horizontal road
    ctx.fillStyle = '#8d8d8d';
    ctx.fillRect(0, 240, world.width, 80);

    // Road stripes
    ctx.fillStyle = '#ffeb3b';
    for (let i = 0; i < world.width; i += 60) {
        ctx.fillRect(i, 277, 30, 6);
    }

    // Vertical road to Academic Center
    ctx.fillStyle = '#8d8d8d';
    ctx.fillRect(260, 0, 60, 280);

    // Vertical road to University Row
    ctx.fillStyle = '#8d8d8d';
    ctx.fillRect(1110, 100, 60, 280);

    // Road markings
    ctx.fillStyle = '#ffffff';
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(290, 0);
    ctx.lineTo(290, 240);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(1140, 100);
    ctx.lineTo(1140, 280);
    ctx.stroke();
    ctx.setLineDash([]);

    // Sidewalks
    ctx.fillStyle = '#b8b8b8';
    ctx.fillRect(0, 235, world.width, 5);
    ctx.fillRect(0, 320, world.width, 5);
    ctx.fillRect(255, 0, 5, 240);
    ctx.fillRect(320, 0, 5, 240);
    ctx.fillRect(1105, 100, 5, 180);
    ctx.fillRect(1170, 100, 5, 180);

    // Draw grass areas for buildings
    // Academic Center lawn
    ctx.fillStyle = '#5fa342';
    ctx.fillRect(100, 100, 380, 130);

    // Add some decorative trees/bushes
    const drawTree = (x, y) => {
        // Tree trunk
        ctx.fillStyle = '#6d4c41';
        ctx.fillRect(x, y, 8, 12);
        // Tree foliage
        ctx.fillStyle = '#388e3c';
        ctx.beginPath();
        ctx.arc(x + 4, y, 12, 0, Math.PI * 2);
        ctx.fill();
    };

    // Trees around Academic Center
    drawTree(120, 120);
    drawTree(440, 120);
    drawTree(120, 340);
    drawTree(440, 340);
    drawTree(280, 350);

    // Trees around University Row
    drawTree(980, 120);
    drawTree(1300, 120);
    drawTree(980, 360);
    drawTree(1300, 360);
    drawTree(1140, 360);

    // Additional decorative trees
    drawTree(600, 150);
    drawTree(850, 200);
    drawTree(650, 380);
    drawTree(900, 420);
    drawTree(50, 180);
    drawTree(50, 360);
    drawTree(1500, 180);
    drawTree(1500, 380);

    // Draw flowers
    const drawFlower = (x, y, color) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f9a825';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
    };

    flowers.forEach(flower => {
        drawFlower(flower.x, flower.y, flower.color);
    });

    // Area signs
    // Academic Center sign
    ctx.fillStyle = '#1976d2';
    ctx.fillRect(280, 90, 20, 35);
    ctx.fillStyle = '#fff';
    ctx.fillRect(275, 85, 30, 20);
    ctx.fillStyle = '#1976d2';
    ctx.font = 'bold 8px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('ACADEMIC', 290, 93);
    ctx.fillText('CENTER', 290, 101);

    // University Row sign
    ctx.fillStyle = '#7b1fa2';
    ctx.fillRect(1130, 75, 20, 35);
    ctx.fillStyle = '#fff';
    ctx.fillRect(1125, 70, 30, 20);
    ctx.fillStyle = '#7b1fa2';
    ctx.fillText('UNIVERSITY', 1140, 78);
    ctx.fillText('ROW', 1140, 86);

    // Draw all NPCs (professors and universities)
    npcs.forEach(npc => {
        // Draw shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(npc.x + 2, npc.y + npc.height + 2, npc.width, 4);

        if (npc.type === 'university') {
            // Draw university building
            ctx.fillStyle = npc.color;
            ctx.fillRect(npc.x, npc.y, npc.width, npc.height);

            // Draw windows
            ctx.fillStyle = '#ffe082';
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 2; j++) {
                    ctx.fillRect(npc.x + 8 + (i * 12), npc.y + 10 + (j * 15), 8, 10);
                }
            }

            // Draw door
            ctx.fillStyle = '#5d4037';
            ctx.fillRect(npc.x + npc.width/2 - 6, npc.y + npc.height - 12, 12, 12);
        } else {
            // Draw professor
            ctx.fillStyle = npc.color;
            ctx.fillRect(npc.x, npc.y, npc.width, npc.height);

            // Draw face
            ctx.fillStyle = '#ffe0bd';
            ctx.fillRect(npc.x + 8, npc.y + 8, 16, 16);

            // Draw eyes
            ctx.fillStyle = '#000';
            ctx.fillRect(npc.x + 10, npc.y + 12, 3, 3);
            ctx.fillRect(npc.x + 19, npc.y + 12, 3, 3);
        }

        // Draw name tag
        const tagWidth = npc.type === 'university' ? npc.width + 40 : npc.width + 20;
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(npc.x - (tagWidth - npc.width)/2, npc.y - 20, tagWidth, 16);
        ctx.fillStyle = '#fff';
        ctx.font = npc.type === 'university' ? '9px Courier New' : '10px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(npc.specialty, npc.x + npc.width/2, npc.y - 9);

        // Draw interaction radius if player is near
        const distance = Math.sqrt(
            Math.pow(player.x - npc.x, 2) +
            Math.pow(player.y - npc.y, 2)
        );
        const interactRadius = npc.type === 'university' ? 80 : 60;
        if (distance < interactRadius) {
            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(npc.x + npc.width/2, npc.y + npc.height/2, interactRadius, 0, Math.PI * 2);
            ctx.stroke();

            // Draw "Press SPACE" indicator
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.fillRect(npc.x - 20, npc.y + npc.height + 10, npc.width + 40, 16);
            ctx.fillStyle = '#000';
            ctx.font = 'bold 10px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText('Press SPACE', npc.x + npc.width/2, npc.y + npc.height + 21);
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

    // Restore context state (removes camera transform for UI elements)
    ctx.restore();
}

// Skill Tree / Inventory Modal Management
const inventoryBtn = document.getElementById('inventory-btn');
const skillTreeModal = document.getElementById('skill-tree-modal');
const closeSkillTreeBtn = document.getElementById('close-skill-tree');
const tabBtns = document.querySelectorAll('.tab-btn');
const certTitleInput = document.getElementById('cert-title');
const certIssuerInput = document.getElementById('cert-issuer');
const certCategorySelect = document.getElementById('cert-category');
const addCertBtn = document.getElementById('add-cert-btn');
const certList = document.getElementById('cert-list');
const goalSkillTitleInput = document.getElementById('goal-skill-title');
const goalSkillCategorySelect = document.getElementById('goal-skill-category');
const addGoalSkillBtn = document.getElementById('add-goal-skill-btn');
const goalSkillList = document.getElementById('goal-skill-list');
const skillTreeCanvas = document.getElementById('skill-tree-canvas');
const skillTreeCtx = skillTreeCanvas.getContext('2d');

inventoryBtn.addEventListener('click', () => {
    skillTreeModal.classList.remove('hidden');
    renderSkillTree();
});

closeSkillTreeBtn.addEventListener('click', () => {
    skillTreeModal.classList.add('hidden');
});

// Press 'I' to open inventory
window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'i' && skillTreeModal.classList.contains('hidden') && dialogBox.classList.contains('hidden') && profileModal.classList.contains('hidden')) {
        skillTreeModal.classList.remove('hidden');
        renderSkillTree();
    }
});

// Tab switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;

        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        document.getElementById(`${targetTab}-tab`).classList.add('active');

        if (targetTab === 'tree') {
            renderSkillTree();
        }
    });
});

// Add certification
addCertBtn.addEventListener('click', () => {
    const title = certTitleInput.value.trim();
    const issuer = certIssuerInput.value.trim();
    const category = certCategorySelect.value;

    if (!title || !issuer || !category) {
        alert('Please fill in all fields');
        return;
    }

    const cert = {
        id: Date.now(),
        title,
        issuer,
        category,
        dateAdded: new Date().toISOString()
    };

    certifications.push(cert);
    saveCertifications();
    renderCertifications();
    renderSkillTree();

    certTitleInput.value = '';
    certIssuerInput.value = '';
    certCategorySelect.value = '';
});

// Add goal skill
addGoalSkillBtn.addEventListener('click', () => {
    const title = goalSkillTitleInput.value.trim();
    const category = goalSkillCategorySelect.value;

    if (!title || !category) {
        alert('Please fill in all fields');
        return;
    }

    const goalSkill = {
        id: Date.now(),
        title,
        category,
        dateAdded: new Date().toISOString()
    };

    goalSkills.push(goalSkill);
    saveGoalSkills();
    renderGoalSkills();

    goalSkillTitleInput.value = '';
    goalSkillCategorySelect.value = '';
});

// Render certifications list
function renderCertifications() {
    certList.innerHTML = '';

    if (certifications.length === 0) {
        certList.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No certifications yet. Add your first one above!</p>';
        return;
    }

    certifications.forEach(cert => {
        const certItem = document.createElement('div');
        certItem.className = 'cert-item';

        certItem.innerHTML = `
            <div class="cert-info">
                <div class="cert-title">${cert.title}</div>
                <div class="cert-details">
                    ${cert.issuer}
                    <span class="cert-category">${cert.category}</span>
                </div>
            </div>
            <button class="cert-remove" data-id="${cert.id}">Remove</button>
        `;

        certList.appendChild(certItem);
    });

    // Add remove handlers
    document.querySelectorAll('.cert-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            certifications = certifications.filter(c => c.id !== id);
            saveCertifications();
            renderCertifications();
            renderSkillTree();
        });
    });
}

// Render goal skills list
function renderGoalSkills() {
    goalSkillList.innerHTML = '';

    if (goalSkills.length === 0) {
        goalSkillList.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No learning goals yet. Add skills you want to learn above!</p>';
        return;
    }

    goalSkills.forEach(skill => {
        const skillItem = document.createElement('div');
        skillItem.className = 'goal-skill-item';

        skillItem.innerHTML = `
            <div class="cert-info">
                <div class="cert-title">🎯 ${skill.title}</div>
                <div class="cert-details">
                    Goal to learn
                    <span class="cert-category">${skill.category}</span>
                </div>
            </div>
            <button class="goal-skill-remove" data-id="${skill.id}">Remove</button>
        `;

        goalSkillList.appendChild(skillItem);
    });

    // Add remove handlers
    document.querySelectorAll('.goal-skill-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            goalSkills = goalSkills.filter(s => s.id !== id);
            saveGoalSkills();
            renderGoalSkills();
        });
    });
}

// Common prerequisite/bridge skills knowledge base
const skillPrerequisites = {
    'Machine Learning': ['Python Programming', 'Statistics', 'Linear Algebra'],
    'Deep Learning': ['Machine Learning', 'Python Programming', 'Calculus'],
    'Data Science': ['Python Programming', 'Statistics', 'SQL'],
    'Web Development': ['HTML/CSS', 'JavaScript'],
    'Backend Development': ['Programming Fundamentals', 'Database Design'],
    'Mobile Development': ['Programming Fundamentals', 'UI/UX Basics'],
    'Game Development': ['Programming Fundamentals', 'Math/Physics'],
    'Cybersecurity': ['Networking Basics', 'Operating Systems'],
    'Cloud Computing': ['Linux', 'Networking Basics'],
    'DevOps': ['Linux', 'Programming Fundamentals', 'Cloud Computing']
};

// Render skill tree
function renderSkillTree() {
    if (!skillTreeCanvas) return;

    const width = 1200;
    const height = 800;
    skillTreeCanvas.width = width;
    skillTreeCanvas.height = height;

    skillTreeCtx.clearRect(0, 0, width, height);

    if (certifications.length === 0 && goalSkills.length === 0) {
        skillTreeCtx.fillStyle = '#999';
        skillTreeCtx.font = '16px Courier New';
        skillTreeCtx.textAlign = 'center';
        skillTreeCtx.fillText('Add certifications and learning goals to build your skill tree!', width/2, height/2);
        return;
    }

    const categoryColors = {
        programming: '#2196f3',
        math: '#ff9800',
        science: '#4caf50',
        design: '#e91e63',
        business: '#9c27b0',
        language: '#00bcd4',
        other: '#757575'
    };

    // Build complete skill tree with three layers
    const allNodes = [];
    const nodeRadius = 35;
    const layerSpacing = 200;
    const nodeSpacing = 150;

    // Layer 1: Current Skills (certifications)
    let layer1Y = 100;
    certifications.forEach((cert, index) => {
        allNodes.push({
            title: cert.title,
            category: cert.category,
            type: 'current',
            x: 150 + (index * nodeSpacing),
            y: layer1Y,
            color: categoryColors[cert.category] || categoryColors.other
        });
    });

    // Calculate bridge skills needed
    const bridgeSkills = new Set();
    goalSkills.forEach(goal => {
        // Try exact match first, then partial match
        let prereqs = skillPrerequisites[goal.title];

        // If no exact match, try to find a partial match in the keys
        if (!prereqs) {
            const matchingKey = Object.keys(skillPrerequisites).find(key =>
                goal.title.toLowerCase().includes(key.toLowerCase()) ||
                key.toLowerCase().includes(goal.title.toLowerCase())
            );
            if (matchingKey) {
                prereqs = skillPrerequisites[matchingKey];
            }
        }

        if (prereqs && prereqs.length > 0) {
            prereqs.forEach(prereq => {
                // Only add if student doesn't already have it
                const hasSkill = certifications.some(cert =>
                    cert.title.toLowerCase().includes(prereq.toLowerCase()) ||
                    prereq.toLowerCase().includes(cert.title.toLowerCase())
                );
                if (!hasSkill) {
                    bridgeSkills.add(prereq);
                }
            });
        }
    });

    // Layer 2: Bridge Skills (needed prerequisites)
    let layer2Y = layer1Y + layerSpacing;
    const bridgeArray = Array.from(bridgeSkills);
    bridgeArray.forEach((skill, index) => {
        // Find category based on skill name
        let category = 'other';
        if (skill.toLowerCase().includes('python') || skill.toLowerCase().includes('programming') || skill.toLowerCase().includes('javascript')) {
            category = 'programming';
        } else if (skill.toLowerCase().includes('math') || skill.toLowerCase().includes('calculus') || skill.toLowerCase().includes('algebra') || skill.toLowerCase().includes('statistics')) {
            category = 'math';
        } else if (skill.toLowerCase().includes('design') || skill.toLowerCase().includes('ui')) {
            category = 'design';
        }

        allNodes.push({
            title: skill,
            category: category,
            type: 'bridge',
            x: 150 + (index * nodeSpacing),
            y: layer2Y,
            color: categoryColors[category] || categoryColors.other
        });
    });

    // Layer 3: Goal Skills
    let layer3Y = layer2Y + layerSpacing;
    goalSkills.forEach((goal, index) => {
        allNodes.push({
            title: goal.title,
            category: goal.category,
            type: 'goal',
            x: 150 + (index * nodeSpacing),
            y: layer3Y,
            color: categoryColors[goal.category] || categoryColors.other
        });
    });

    // Draw connections
    allNodes.forEach(node => {
        if (node.type === 'bridge') {
            // Connect to current skills
            allNodes.filter(n => n.type === 'current').forEach(currentNode => {
                skillTreeCtx.strokeStyle = '#90caf9';
                skillTreeCtx.lineWidth = 2;
                skillTreeCtx.setLineDash([5, 5]);
                skillTreeCtx.beginPath();
                skillTreeCtx.moveTo(currentNode.x, currentNode.y + nodeRadius);
                skillTreeCtx.lineTo(node.x, node.y - nodeRadius);
                skillTreeCtx.stroke();
                skillTreeCtx.setLineDash([]);
            });
        }
        if (node.type === 'goal') {
            // Connect to bridge skills or current skills
            const bridgeNodes = allNodes.filter(n => n.type === 'bridge');
            const connectTo = bridgeNodes.length > 0 ? bridgeNodes : allNodes.filter(n => n.type === 'current');

            connectTo.forEach(prevNode => {
                skillTreeCtx.strokeStyle = '#ffcc80';
                skillTreeCtx.lineWidth = 2;
                skillTreeCtx.setLineDash([10, 5]);
                skillTreeCtx.beginPath();
                skillTreeCtx.moveTo(prevNode.x, prevNode.y + nodeRadius);
                skillTreeCtx.lineTo(node.x, node.y - nodeRadius);
                skillTreeCtx.stroke();
                skillTreeCtx.setLineDash([]);
            });
        }
    });

    // Draw all nodes
    allNodes.forEach(node => {
        const x = node.x;
        const y = node.y;

        // Draw node based on type
        if (node.type === 'current') {
            // Solid filled circle for current skills
            skillTreeCtx.fillStyle = node.color;
            skillTreeCtx.beginPath();
            skillTreeCtx.arc(x, y, nodeRadius, 0, Math.PI * 2);
            skillTreeCtx.fill();
            skillTreeCtx.strokeStyle = '#000';
            skillTreeCtx.lineWidth = 3;
            skillTreeCtx.stroke();

            // Checkmark
            skillTreeCtx.fillStyle = '#fff';
            skillTreeCtx.font = 'bold 24px Courier New';
            skillTreeCtx.textAlign = 'center';
            skillTreeCtx.textBaseline = 'middle';
            skillTreeCtx.fillText('✓', x, y);
        } else if (node.type === 'bridge') {
            // Dashed outline for bridge skills
            skillTreeCtx.fillStyle = '#fff';
            skillTreeCtx.beginPath();
            skillTreeCtx.arc(x, y, nodeRadius, 0, Math.PI * 2);
            skillTreeCtx.fill();
            skillTreeCtx.strokeStyle = node.color;
            skillTreeCtx.lineWidth = 4;
            skillTreeCtx.setLineDash([8, 4]);
            skillTreeCtx.stroke();
            skillTreeCtx.setLineDash([]);

            // Arrow icon
            skillTreeCtx.fillStyle = node.color;
            skillTreeCtx.font = 'bold 20px Courier New';
            skillTreeCtx.textAlign = 'center';
            skillTreeCtx.textBaseline = 'middle';
            skillTreeCtx.fillText('→', x, y);
        } else if (node.type === 'goal') {
            // Dotted outline for goals
            skillTreeCtx.fillStyle = '#fffde7';
            skillTreeCtx.beginPath();
            skillTreeCtx.arc(x, y, nodeRadius, 0, Math.PI * 2);
            skillTreeCtx.fill();
            skillTreeCtx.strokeStyle = node.color;
            skillTreeCtx.lineWidth = 4;
            skillTreeCtx.setLineDash([4, 4]);
            skillTreeCtx.stroke();
            skillTreeCtx.setLineDash([]);

            // Star icon
            skillTreeCtx.fillStyle = node.color;
            skillTreeCtx.font = 'bold 22px Courier New';
            skillTreeCtx.textAlign = 'center';
            skillTreeCtx.textBaseline = 'middle';
            skillTreeCtx.fillText('★', x, y);
        }

        // Draw title below node
        skillTreeCtx.fillStyle = '#333';
        skillTreeCtx.font = 'bold 11px Courier New';
        skillTreeCtx.textAlign = 'center';
        const titleWords = node.title.split(' ');
        let line = '';
        let lineY = y + nodeRadius + 15;

        titleWords.forEach((word, i) => {
            const testLine = line + word + ' ';
            const metrics = skillTreeCtx.measureText(testLine);
            if (metrics.width > 100 && i > 0) {
                skillTreeCtx.fillText(line.trim(), x, lineY);
                line = word + ' ';
                lineY += 13;
            } else {
                line = testLine;
            }
        });
        skillTreeCtx.fillText(line.trim(), x, lineY);

        // Draw type label
        skillTreeCtx.font = '9px Courier New';
        skillTreeCtx.fillStyle = '#666';
        let typeLabel = '';
        if (node.type === 'current') typeLabel = 'HAVE';
        if (node.type === 'bridge') typeLabel = 'NEED';
        if (node.type === 'goal') typeLabel = 'WANT';
        skillTreeCtx.fillText(typeLabel, x, y - nodeRadius - 8);
    });
}

// Game loop
function gameLoop() {
    updatePlayer();
    updateCamera();
    draw();
    requestAnimationFrame(gameLoop);
}

// Recommendations modal management
const recommendationsBtn = document.getElementById('recommendations-btn');
const recommendationsModal = document.getElementById('recommendations-modal');
const closeRecommendationsBtn = document.getElementById('close-recommendations');
const recommendationsLoading = document.getElementById('recommendations-loading');
const recommendationsResult = document.getElementById('recommendations-result');

recommendationsBtn.addEventListener('click', async () => {
    recommendationsModal.classList.remove('hidden');
    recommendationsLoading.classList.remove('hidden');
    recommendationsResult.innerHTML = '';

    try {
        // Gather all data
        const response = await fetch('/api/recommendations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userProfile,
                conversationHistory,
                certifications,
                goalSkills,
                universities: universities.map(u => ({ name: u.name, specialty: u.specialty, location: u.location }))
            })
        });

        const data = await response.json();

        recommendationsLoading.classList.add('hidden');

        if (data.error) {
            recommendationsResult.innerHTML = '<p style="color: red;">Failed to generate recommendations. Please try again.</p>';
        } else {
            // Format the recommendations nicely
            const formatted = data.recommendations
                .split('\n\n')
                .map(section => {
                    if (section.trim().startsWith('#')) {
                        const lines = section.split('\n');
                        const header = lines[0].replace(/^#+\s*/, '');
                        const content = lines.slice(1).join('\n');
                        return `<div class="recommendation-section"><h3>${header}</h3><p>${content.replace(/\n/g, '<br>')}</p></div>`;
                    }
                    return `<p>${section.replace(/\n/g, '<br>')}</p>`;
                })
                .join('');

            recommendationsResult.innerHTML = formatted || data.recommendations.replace(/\n/g, '<br>');
        }
    } catch (error) {
        console.error('Recommendations error:', error);
        recommendationsLoading.classList.add('hidden');
        recommendationsResult.innerHTML = '<p style="color: red;">Failed to generate recommendations. Please check your connection and try again.</p>';
    }
});

closeRecommendationsBtn.addEventListener('click', () => {
    recommendationsModal.classList.add('hidden');
});

// Fast travel modal management
const fastTravelBtn = document.getElementById('fast-travel-btn');
const fastTravelModal = document.getElementById('fast-travel-modal');
const closeFastTravelBtn = document.getElementById('close-fast-travel');
const fastTravelButtons = document.querySelectorAll('.fast-travel-btn');

fastTravelBtn.addEventListener('click', () => {
    fastTravelModal.classList.remove('hidden');
});

closeFastTravelBtn.addEventListener('click', () => {
    fastTravelModal.classList.add('hidden');
});

fastTravelButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const npcId = btn.getAttribute('data-npc');
        const npc = npcs.find(n => n.id === npcId);

        if (npc) {
            // Teleport player near the NPC
            player.x = npc.x - 50;
            player.y = npc.y;

            // Close modal
            fastTravelModal.classList.add('hidden');
        }
    });
});

// Keyboard shortcuts (only when not typing in input fields)
window.addEventListener('keydown', (e) => {
    // Check if user is typing in an input field
    const isTyping = document.activeElement.tagName === 'INPUT' ||
                     document.activeElement.tagName === 'TEXTAREA';

    if (isTyping) return; // Don't trigger shortcuts while typing

    if (e.key.toLowerCase() === 'p') {
        profileModal.classList.remove('hidden');
    }
    if (e.key.toLowerCase() === 'i') {
        skillTreeModal.classList.remove('hidden');
    }
    if (e.key.toLowerCase() === 'r') {
        recommendationsBtn.click();
    }
    if (e.key.toLowerCase() === 't') {
        fastTravelModal.classList.remove('hidden');
    }
    if (e.key === 'Escape') {
        dialogBox.classList.add('hidden');
        profileModal.classList.add('hidden');
        skillTreeModal.classList.add('hidden');
        recommendationsModal.classList.add('hidden');
        fastTravelModal.classList.add('hidden');
    }
});

// Initialize
loadProfile();
loadCertifications();
loadGoalSkills();
gameLoop();
