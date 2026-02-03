import { supabase } from "@/integrations/supabase/client";

export async function generateAIResponse(
  messages: { role: string; content: string }[],
  agentType: 'TRIAGE' | 'RECOVERY' | 'BILLING',
  userId: string = "demo_user"
) {
  const lastMessage = messages[messages.length - 1];
  const messageContent = lastMessage?.content || "";

  try {
    const { data, error } = await supabase.functions.invoke('chat', {
      body: {
        message: messageContent,
        agent_type: agentType
      }
    });

    if (error) {
      console.error("Edge function error:", error);
      return null;
    }

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
