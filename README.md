# Study Village

A Pokémon-style web game where players can explore a virtual campus, talk to professors about different study programs, and get personalized university recommendations using AI-powered conversations.

## Features

- **Retro Game Experience**: Explore a pixelated campus world using arrow keys or WASD
- **AI-Powered NPCs**: Chat with professors and university counselors powered by Claude AI
- **Multiple Disciplines**: Learn about Computer Science, Biology, Engineering, and Fine Arts
- **Belgian Universities**: Get admissions guidance for KU Leuven, UGent, Howest, and Thomas More
- **Personalized Profile**: Build your student profile with background, interests, and career goals
- **Skill Tree System**: Track certifications, visualize learning paths, and set skill goals
- **Smart Recommendations**: Receive personalized university and program suggestions based on your profile
- **Fast Travel**: Quickly navigate between professors and universities
- **Conversation Memory**: NPCs remember your previous conversations for contextual responses

## NPCs

### Professors (Academic Center)
- **Prof. Ada Code** (Computer Science) - Expert in programming, AI, and software engineering
- **Prof. Darwin Green** (Biology) - Specialist in molecular biology, genetics, and ecology
- **Prof. Tesla Wright** (Engineering) - Focused on mechanical, electrical, and civil engineering
- **Prof. Monet Canvas** (Fine Arts) - Teaching visual arts, design, and creative expression

### Universities (University Row)
- **KU Leuven** - Top Belgian university in Leuven, offering research-intensive programs
- **UGent** (Ghent University) - Leading university in Ghent, strong in sciences and engineering
- **Howest** - Applied sciences university in Kortrijk/Bruges with practical programs (DAE, Applied CS)
- **Thomas More** - Hogeschool in Antwerp/Mechelen focusing on professional education

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the project root:
```bash
ANTHROPIC_API_KEY=your-api-key-here
PORT=3000
```

3. Get your Anthropic API key from [https://console.anthropic.com/](https://console.anthropic.com/)

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

5. Open `http://localhost:3000` in your browser

## Controls

### Movement
- **Arrow Keys** or **WASD** - Move your character
- **SPACE** - Talk to NPCs (when near them)
- **ESC** - Close any dialog/modal

### Shortcuts
- **P** - Open Profile
- **I** - Open Inventory/Skill Tree
- **R** - Get Recommendations
- **T** - Fast Travel menu

## How to Play

1. **Start Exploring**: Move around the campus using arrow keys or WASD
2. **Build Your Profile**: Press **P** to fill out your background, interests, and career goals
3. **Talk to Professors**: Walk to the Academic Center (left side) and chat with professors about different fields
4. **Visit Universities**: Explore University Row (right side) to learn about admissions and programs
5. **Track Your Skills**: Press **I** to add certifications you have and skills you want to learn
6. **Get Recommendations**: Press **R** to receive personalized university and program suggestions based on your conversations and profile
7. **Fast Travel**: Press **T** to quickly teleport to any NPC

## Game Features

### Student Profile System
- Save your name, background/CV, favorite subjects, career goals, and learning style
- Profile persists in browser localStorage
- Professors use your profile to personalize their advice and recommendations

### Skill Tree
- Add certifications and skills you currently have
- Set learning goals for skills you want to acquire
- Visualize your learning path with an interactive skill tree
- Automatic prerequisite suggestions based on your goals

### Smart Recommendations
- AI-powered analysis of your profile, conversations, skills, and goals
- Personalized university recommendations from available Belgian universities
- Suggested programs/majors tailored to your interests
- Actionable next steps and areas to improve

### World Map
- **Academic Center** (left): Talk to 4 professors about different study fields
- **University Row** (right): Get admissions guidance from 4 Belgian universities
- **Roads & Paths**: Navigate between areas using the main road and vertical paths

## Customization

### Adding More NPCs

Edit the `professors` or `universities` array in `game.js`:

```javascript
{
    id: 'physics',
    name: 'Prof. Newton Force',
    x: 200,
    y: 450,
    width: 32,
    height: 32,
    color: '#9c27b0',
    specialty: 'Physics',
    type: 'professor',
    systemPrompt: 'You are Professor Newton Force, a physics expert...'
}
```

### Modifying the Skill Tree

Edit `skillPrerequisites` in `game.js` to add prerequisite relationships:

```javascript
const skillPrerequisites = {
    'Quantum Computing': ['Linear Algebra', 'Quantum Mechanics', 'Python'],
    // Add more...
};
```

## Technologies

- **Frontend**: HTML5 Canvas, Vanilla JavaScript, LocalStorage
- **Backend**: Node.js, Express
- **AI**: Anthropic Claude (Sonnet 4.5 for chat, Sonnet 4 for recommendations)
- **Environment**: dotenv for configuration

## License

MIT
