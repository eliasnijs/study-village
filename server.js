require('dotenv').config();
const express = require('express');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

app.use(express.json());
app.use(express.static(__dirname));

// Chat endpoint with Anthropic Claude
app.post('/api/chat', async (req, res) => {
    try {
        const { professorId, message, systemPrompt, userProfile, conversationHistory, certifications } = req.body;

        // Build enhanced system prompt with user context
        let enhancedSystemPrompt = systemPrompt;

        if (userProfile && (userProfile.name || userProfile.cv || userProfile.favoriteSubjects || userProfile.careerGoals || userProfile.learningStyle)) {
            enhancedSystemPrompt += '\n\n--- STUDENT CONTEXT ---\n';

            if (userProfile.name) {
                enhancedSystemPrompt += `Student Name: ${userProfile.name}\n`;
            }
            if (userProfile.cv) {
                enhancedSystemPrompt += `Background/CV: ${userProfile.cv}\n`;
            }
            if (userProfile.favoriteSubjects) {
                enhancedSystemPrompt += `Favorite Subjects: ${userProfile.favoriteSubjects}\n`;
            }
            if (userProfile.careerGoals) {
                enhancedSystemPrompt += `Career Goals: ${userProfile.careerGoals}\n`;
            }
            if (userProfile.learningStyle) {
                enhancedSystemPrompt += `Learning Style: ${userProfile.learningStyle}\n`;
            }

            enhancedSystemPrompt += '\nUse this context to personalize your responses and provide relevant advice tailored to this student\'s background, interests, and goals. Reference their profile naturally in conversation when appropriate.';
        }

        // Add certifications/skills to context
        if (certifications && certifications.length > 0) {
            enhancedSystemPrompt += '\n\n--- STUDENT CERTIFICATIONS & SKILLS ---\n';
            certifications.forEach(cert => {
                enhancedSystemPrompt += `- ${cert.title} (${cert.category}) from ${cert.issuer}\n`;
            });
            enhancedSystemPrompt += '\nConsider these certifications when discussing their readiness for programs, potential career paths, and areas for growth. Acknowledge their achievements and suggest how they can build on them.';
        }

        // Build conversation messages from history (excluding the current message)
        const messages = conversationHistory
            .slice(0, -1) // Exclude last message (current user message we're about to add)
            .map(msg => ({
                role: msg.role,
                content: msg.content
            }));

        // Add current message
        messages.push({ role: 'user', content: message });

        const completion = await anthropic.messages.create({
            model: "claude-sonnet-4-5",
            max_tokens: 1024,
            system: enhancedSystemPrompt,
            messages: messages
        });

        const response = completion.content[0].text;
        res.json({ response });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process chat request' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Study Village server running on http://localhost:${PORT}`);
    console.log('Open this URL in your browser to play!');
});
