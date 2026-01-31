from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import os
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

KEYWORDS_API_KEY = os.getenv("KEYWORDS_API_KEY")
KEYWORDS_URL = "https://api.keywordsai.co/api/v1/chat/completions"

# System Prompts moved to backend for security & centralized control
SYSTEM_PROMPTS = {
  "TRIAGE": """You are an advanced medical triage AI assistant called MediLink.
Your goal is to assess patient symptoms and categorize them into: EMERGENCY, URGENT, or ROUTINE.

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
- Response must be valid JSON with no extra text""",

  "RECOVERY": """You are a compassionate post-operative recovery nurse assistant.
The patient is recovering from a medical procedure.
Generate ONE empathetic follow-up question based on their previous response.
Keep it conversational and under 20 words.
Focus on: pain levels, mobility, medication adherence, or emotional wellbeing.
Do not output JSON - just natural language text."""
}

class ChatRequest(BaseModel):
    message: str
    agent_type: str = "TRIAGE" # Default to Triage
    role: str = "user" # Not strictly used but kept for compatibility

@app.get("/")
def root():
    return {"status": "MediLink backend running"}

@app.post("/chat")
def chat(req: ChatRequest):
    if not KEYWORDS_API_KEY:
        raise HTTPException(status_code=500, detail="Backend API Key not configured")

    system_prompt = SYSTEM_PROMPTS.get(req.agent_type, SYSTEM_PROMPTS["TRIAGE"])
    
    # Model selection - using 1.5 Flash as it is the current stable version
    model = "gemini-1.5-flash" if req.agent_type == "TRIAGE" else "gemini-1.5-flash"

    payload = {
        "model": model, 
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": req.message}
        ],
        "stream": False,
        "metadata": {
            "agent_type": req.agent_type,
            "source": "medilink-backend"
        }
    }

    headers = {
        "Authorization": f"Bearer {KEYWORDS_API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(KEYWORDS_URL, json=payload, headers=headers)
        
        if response.status_code != 200:
            error_msg = f"Keywords AI Error ({response.status_code}): {response.text}"
            print(error_msg)
            return {"reply": f"Error: {response.text}"} # Return actual error to frontend

        data = response.json()
        content = data["choices"][0]["message"]["content"]
        
        return {"reply": content}

    except Exception as e:
        print(f"Server Error: {str(e)}")
        return {"reply": "Internal server error"}
