// UPDATED: Now communicating with local Python backend
// Original config/prompts are now handled by the Agent on the backend side theoretically,
// but for now we are just hitting the backend /chat endpoint which proxies to the Agent.

const BACKEND_URL = "http://127.0.0.1:8001/chat";

export async function generateAIResponse(
    messages: { role: string; content: string }[],
    agentType: 'TRIAGE' | 'RECOVERY',
    userId: string = "demo_user"
) {
    // Extract the latest user message to send to the backend
    const lastMessage = messages[messages.length - 1];
    const messageContent = lastMessage?.content || "";

    try {
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: messageContent,
                agent_type: agentType,
                role: "user"
            }),
        });

        if (!response.ok) {
            throw new Error(`Backend error: ${response.status}`);
        }

        const data = await response.json();
        const reply = data.reply;

        // Parse JSON for TRIAGE agent if necessary
        // Note: The backend Agent must be configured to return JSON for this to work
        if (agentType === 'TRIAGE') {
            try {
                const content = reply
                    .replace(/```json\n?/g, '')
                    .replace(/```\n?/g, '')
                    .trim();
                return JSON.parse(content);
            } catch (e) {
                console.warn("Failed to parse triage JSON from backend:", e);
                return {
                    severity: "routine",
                    recommendation: "Please consult with a healthcare provider.",
                    response: reply,
                    suggested_specialty: "General Practice"
                };
            }
        }

        return reply;
    } catch (error) {
        console.error("Backend Connection Error:", error);
        return null;
    }
}
