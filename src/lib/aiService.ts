// Direct fetch to Edge Function - more reliable than Supabase client in preview environments
const SUPABASE_URL = "https://jnriouxzlodzdpjtjano.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucmlvdXh6bG9kemRwanRqYW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwODMxNzEsImV4cCI6MjA4NTY1OTE3MX0.BS_Zbzhsl_rkY-Hd30eP2Bih9ARCXZTJzOgFasb5Ics";

export async function generateAIResponse(
  messages: { role: string; content: string }[],
  agentType: 'TRIAGE' | 'RECOVERY' | 'BILLING',
  userId: string = "demo_user"
) {
  const lastMessage = messages[messages.length - 1];
  const messageContent = lastMessage?.content || "";

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        message: messageContent,
        agent_type: agentType
      })
    });

    if (!response.ok) {
      console.error("Edge function error:", response.status, await response.text());
      return null;
    }

    const data = await response.json();
    const reply = data?.reply;

    if (!reply) {
      console.error("No reply in response");
      return null;
    }

    // Parse JSON for TRIAGE agent
    if (agentType === 'TRIAGE') {
      try {
        const content = reply
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
        return JSON.parse(content);
      } catch (e) {
        console.warn("Failed to parse triage JSON:", e);
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
    console.error("AI Service Error:", error);
    return null;
  }
}
