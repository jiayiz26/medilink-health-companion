import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { TriageResult } from "@/components/chat/TriageResult";
import { Bot, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { generateAIResponse } from "@/lib/keywordsai";
import { TriageResponse } from "@/types/ai";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hi! I'm your MediLink health assistant. I'm here to help you understand your symptoms and guide you to the right care.\n\nPlease describe what you're experiencing, and I'll help determine the best next steps.",
  },
];

// Simple triage logic for demo
function analyzeSymptoms(message: string): {
  severity: "emergency" | "urgent" | "routine";
  recommendation: string;
  response: string;
} {
  const lowerMsg = message.toLowerCase();

  if (
    lowerMsg.includes("chest pain") ||
    lowerMsg.includes("can't breathe") ||
    lowerMsg.includes("stroke") ||
    lowerMsg.includes("severe bleeding")
  ) {
    return {
      severity: "emergency",
      recommendation:
        "Based on your symptoms, you should seek emergency care immediately. Please call 911 or go to the nearest emergency room.",
      response:
        "I'm concerned about what you've described. These symptoms require immediate medical attention.",
    };
  }

  if (
    lowerMsg.includes("fever") ||
    lowerMsg.includes("pain") ||
    lowerMsg.includes("swelling") ||
    lowerMsg.includes("infection")
  ) {
    return {
      severity: "urgent",
      recommendation:
        "Your symptoms suggest you should see a doctor within the next 24-48 hours. I recommend booking an urgent care appointment.",
      response:
        "Thank you for sharing that. Based on your symptoms, it would be best to see a healthcare provider soon.",
    };
  }

  return {
    severity: "routine",
    recommendation:
      "Your symptoms can likely be addressed in a routine appointment. I can help you book a convenient time with your primary care provider.",
    response:
      "I understand. These symptoms don't appear to require urgent care, but it's still a good idea to discuss them with your doctor.",
  };
}

export default function Symptoms() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [triageResult, setTriageResult] = useState<{
    severity: "emergency" | "urgent" | "routine";
    recommendation: string;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, triageResult]);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Call Keywords AI Triage Agent
      const response = await generateAIResponse(
        [{ role: "user", content }],
        'TRIAGE',
        'demo_patient_123'
      ) as TriageResponse | null;

      setIsTyping(false);

      if (response) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.response,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setTriageResult({
          severity: response.severity,
          recommendation: response.recommendation,
        });
      } else {
        // Fallback for network errors
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm having trouble connecting right now. If this is an emergency, please call 911 immediately."
        }]);
        setTriageResult({
          severity: "emergency",
          recommendation: "Call 911 if this is an emergency"
        });
      }
    } catch (error) {
      console.error("Error in symptom analysis:", error);
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl medical-gradient">
          <Bot className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            AI Symptom Checker
            <Sparkles className="h-4 w-4 text-primary" />
          </h1>
          <p className="text-sm text-muted-foreground">
            Describe your symptoms for personalized guidance
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-card border border-border mb-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
              <span
                className="w-2 h-2 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: "0.1s" }}
              />
              <span
                className="w-2 h-2 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
            <span className="text-sm">MediLink is analyzing...</span>
          </div>
        )}

        {triageResult && (
          <TriageResult
            severity={triageResult.severity}
            recommendation={triageResult.recommendation}
            onBookAppointment={() => navigate("/booking")}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  );
}
