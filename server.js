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
        const { professorId, message, systemPrompt, userProfile, conversationHistory, certifications, goalSkills } = req.body;

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

        // Add learning goals to context
        if (goalSkills && goalSkills.length > 0) {
            enhancedSystemPrompt += '\n\n--- SKILLS STUDENT WANTS TO LEARN ---\n';
            goalSkills.forEach(skill => {
                enhancedSystemPrompt += `- ${skill.title} (${skill.category})\n`;
            });
            enhancedSystemPrompt += '\nThese are skills the student is interested in learning. Help them understand how these goals align with programs, suggest resources or courses, and provide guidance on how to achieve these learning objectives.';
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

// Recommendations endpoint
app.post('/api/recommendations', async (req, res) => {
    try {
        const { userProfile, conversationHistory, certifications, goalSkills, universities } = req.body;

        // Build context from recent conversations (last 3 messages per NPC to reduce tokens)
        let conversationSummary = '';
        Object.keys(conversationHistory).forEach(npcId => {
            const history = conversationHistory[npcId];
            if (history.length > 0) {
                conversationSummary += `\n\n--- Conversation with ${npcId} ---\n`;
                const recentHistory = history.slice(-6); // Last 6 messages (3 exchanges)
                recentHistory.forEach(msg => {
                    conversationSummary += `${msg.role}: ${msg.content}\n`;
                });
            }
        });

        // Build the recommendation prompt
        let prompt = `You are an expert university admissions counselor. Analyze the following student information and provide personalized university and program recommendations.

STUDENT PROFILE:
${userProfile.name ? `Name: ${userProfile.name}` : ''}
${userProfile.cv ? `Background: ${userProfile.cv}` : ''}
${userProfile.favoriteSubjects ? `Favorite Subjects: ${userProfile.favoriteSubjects}` : ''}
${userProfile.careerGoals ? `Career Goals: ${userProfile.careerGoals}` : ''}
${userProfile.learningStyle ? `Learning Style: ${userProfile.learningStyle}` : ''}

CERTIFICATIONS & SKILLS:
${certifications.length > 0 ? certifications.map(c => `- ${c.title} (${c.category})`).join('\n') : 'None listed'}

LEARNING GOALS:
${goalSkills.length > 0 ? goalSkills.map(s => `- ${s.title} (${s.category})`).join('\n') : 'None listed'}

AVAILABLE UNIVERSITIES:
${universities.map(u => `- ${u.name} (${u.specialty}) - Location: ${u.location}`).join('\n')}

CONVERSATION HISTORY:
${conversationSummary || 'No conversations yet'}

Based on this comprehensive information, provide:
1. Top 3 recommended universities from the available list and explain why each is a good match
2. Recommended programs/majors based on their interests, skills, and goals
3. Action items - specific steps they should take next (talk to specific professors, build certain skills, research programs, etc.)
4. Areas of concern or gaps they should address

Format your response in clear sections with headers. Be specific, honest, and actionable. Reference their actual profile details and conversations.`;

        const completion = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1024,
            system: 'IMPORTANT: Respond in plain conversational text only. Do NOT use markdown formatting, bullet points, asterisks, hashtags for headers, or special formatting. Write naturally as if speaking in a casual conversation. Use line breaks for structure but no special characters for formatting.',
            messages: [{ role: 'user', content: prompt }]
        });

        const recommendations = completion.content[0].text;
        res.json({ recommendations });

    } catch (error) {
        console.error('Recommendations error:', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Study Village server running on http://localhost:${PORT}`);
    console.log('Open this URL in your browser to play!');
});
