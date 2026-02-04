import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const KEYWORDS_URL = "https://api.keywordsai.co/api/v1/chat/completions";

const SYSTEM_PROMPTS: Record<string, string> = {
  TRIAGE: `You are MediLink Triage AI. Assess symptoms into: EMERGENCY, URGENT, or ROUTINE.

Output ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "severity": "emergency" | "urgent" | "routine",
  "recommendation": "Clear action step",
  "response": "Empathetic natural language response",
  "suggested_specialty": "e.g. Cardiology, Dermatology"
}

CRITICAL RULES:
- If user mentions chest pain, difficulty breathing, severe bleeding, stroke symptoms, or loss of consciousness: severity MUST be "emergency"
- If user mentions high fever (>103°F), severe pain, or sudden vision changes: severity should be "urgent"
- For mild symptoms or routine concerns: severity should be "routine"
- Always be empathetic and clear
- Never diagnose - only triage and recommend appropriate care level
- Response must be valid JSON with no extra text`,

  RECOVERY: `You are a compassionate post-operative recovery nurse assistant.
The patient is recovering from a medical procedure.
Generate ONE empathetic follow-up question based on their previous response.
Keep it conversational and under 20 words.
Focus on: pain levels, mobility, medication adherence, or emotional wellbeing.
Do not output JSON - just natural language text.`,

  BILLING: `You are an expert Medical Billing Advocate and Insurance Appeals Specialist.
Your goal is to help patients fight incorrect medical bills and insurance denials.

INPUT: A medical bill or insurance denial letter text.

TASK:
1. Analyze the text for common errors (coding errors, lack of medical necessity, duplicate charges).
2. Explain the denial in simple, 5th-grade English.
3. Draft a formal, professional appeal letter citing standard patient rights.

OUTPUT JSON FORMAT:
{
  "summary": "Simple explanation of why it was denied.",
  "error_type": "Coding Error | Medical Necessity | Network Issue | Other",
  "appeal_letter": "Full text of the appeal letter...",
  "next_steps": ["Step 1", "Step 2"]
}`
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const KEYWORDS_API_KEY = Deno.env.get("KEYWORDS_API_KEY");
    
    // Debug: Log partial key for verification (first 3 + last 3 chars)
    if (KEYWORDS_API_KEY) {
      const masked = `${KEYWORDS_API_KEY.slice(0, 3)}...${KEYWORDS_API_KEY.slice(-3)}`;
      console.log(`[DEBUG] KEYWORDS_API_KEY present: ${masked}`);
    } else {
      console.log("[DEBUG] KEYWORDS_API_KEY is EMPTY or undefined");
    }
    
    if (!KEYWORDS_API_KEY) {
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, agent_type = "TRIAGE" } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = SYSTEM_PROMPTS[agent_type] || SYSTEM_PROMPTS.TRIAGE;
    const model = "openai/gpt-5-mini";

    const payload = {
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      stream: false,
      customer_identifier: "medilink_patient",
      metadata: {
        agent_type,
        source: "lovable_cloud"
      }
    };

    const response = await fetch(KEYWORDS_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${KEYWORDS_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Keywords AI Error:", errorText);
      return new Response(
        JSON.stringify({ error: `Keywords AI error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    return new Response(
      JSON.stringify({ reply: content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
