# Study Village

A Pokémon-style web game where players can explore a virtual campus and talk to professors about different university study programs using AI-powered conversations.

## Features

- **Retro Game Experience**: Move around a pixelated world using arrow keys or WASD
- **AI-Powered Professors**: Chat with professors who use LLMs to answer questions about their fields
- **Multiple Disciplines**: Explore Computer Science, Biology, Engineering, and Fine Arts
- **Interactive Conversations**: Ask questions and get detailed, personalized responses

## Professors

- **Prof. Ada Code** (Computer Science) - Expert in programming, AI, and software engineering
- **Prof. Darwin Green** (Biology) - Specialist in molecular biology, genetics, and ecology
- **Prof. Tesla Wright** (Engineering) - Focused on mechanical, electrical, and civil engineering
- **Prof. Monet Canvas** (Fine Arts) - Teaching visual arts, design, and creative expression

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure LLM API (choose one):

### Option 1: OpenAI
```bash
npm install openai
export OPENAI_API_KEY='your-api-key'
```

Uncomment the OpenAI section in `server.js`

### Option 2: Anthropic Claude
```bash
npm install @anthropic-ai/sdk
export ANTHROPIC_API_KEY='your-api-key'
```

Uncomment the Anthropic section in `server.js`

3. Start the server:
```bash
npm start
```

4. Open `http://localhost:3000` in your browser

## Controls

- **Arrow Keys** or **WASD** - Move your character
- **SPACE** - Talk to professors (when near them)
- **Click X** or **ESC** - Close dialog

## How to Play

1. Move your character around the campus using arrow keys or WASD
2. Walk near any professor until you see a glowing circle and "Press SPACE" prompt
3. Press SPACE to start a conversation
4. Type your questions about their field of study
5. Learn about programs, careers, and what to expect from different majors!

## Customization

### Adding More Professors

Edit the `professors` array in `game.js`:

```javascript
{
    id: 'math',
    name: 'Prof. Euler Prime',
    x: 400,
    y: 300,
    width: 32,
    height: 32,
    color: '#9c27b0',
    specialty: 'Mathematics',
    systemPrompt: 'You are Professor Euler Prime...'
}
```

### Changing the Map

Modify the canvas drawing in `game.js` to add buildings, paths, or decorations.

## Technologies

- **Frontend**: HTML5 Canvas, Vanilla JavaScript
- **Backend**: Node.js, Express
- **AI**: OpenAI GPT / Anthropic Claude (configurable)

## License

MIT
