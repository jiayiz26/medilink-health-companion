import { SYSTEM_PROMPTS } from '../config/prompts';

const KEYWORDS_AI_URL = "https://api.keywordsai.co/api/v1/chat/completions";
const API_KEY = import.meta.env.VITE_KEYWORDS_AI_KEY;

export async function generateAIResponse(
    messages: { role: string; content: string }[],
    agentType: 'TRIAGE' | 'RECOVERY',
    userId: string = "demo_user"
) {
    const systemPrompt = SYSTEM_PROMPTS[agentType];

    // CRITICAL: Use Gemini models, not GPT
    const model = agentType === 'TRIAGE'
        ? 'gemini-2.5-flash'       // Fast + accurate for triage
        : 'gemini-flash-latest';    // Cheapest for simple Q&A

    try {
        const response = await fetch(KEYWORDS_AI_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: "system", content: systemPrompt },
                    ...messages
                ],
                stream: false,
                customer_identifier: userId,
                thread_identifier: `thread_${Date.now()}`,
                prompt_name: `${agentType.toLowerCase()}_agent_v1`,
                metadata: {
                    agent_type: agentType,
                    environment: "hackathon_demo",
                    model_provider: "google",
                    timestamp: new Date().toISOString()
                }
            }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (agentType === 'TRIAGE') {
            try {
                const content = data.choices[0].message.content
                    .replace(/```json\n?/g, '')
                    .replace(/```\n?/g, '')
                    .trim();
                return JSON.parse(content);
            } catch (e) {
                console.warn("Failed to parse JSON, using fallback", e);
                return {
                    severity: "routine",
                    recommendation: "Please consult a healthcare provider.",
                    response: data.choices[0].message.content,
                    suggested_specialty: "General Practice"
                };
            }
        }

        return data.choices[0].message.content;

    } catch (error) {
        console.error("AI Error:", error);
        return null;
    }
}
