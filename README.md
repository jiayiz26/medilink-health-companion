# 🏥 MediLink Health Companion

**Smart Triage. Instant Clarity. Professional Care.**

MediLink is an AI-powered medical assistant built during the **UIUC Hackathon 2026**. It helps users bridge the gap between uncertainty and professional medical advice by providing real-time symptom analysis and urgency triaging.

---

## 🌟 Key Features
- **Intelligent Symptom Analysis**: Powered by LLMs to understand natural language descriptions.
- **Dynamic Triaging**: Automatically classifies cases into **Routine**, **Urgent**, or **Emergency**.
- **Visual Health Insights**: Real-time feedback with color-coded severity indicators.
- **Enterprise-Grade Observability**: Integrated with Keywords AI for request monitoring and cost tracking.

## 🛠️ Tech Stack
- **AI Orchestration**: Keywords AI (Gateway & Observability)
- **AI IDE**: Trae (Adaptive Development)
- **UI/UX Framework**: Lovable (Rapid Prototyping)
- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui

---

## 🚀 Getting Started (Installation & Setup)

Follow these steps to get the project running locally:

```sh
# 1. Clone the repository
git clone [https://github.com/jiayiz26/medilink-health-companion.git](https://github.com/jiayiz26/medilink-health-companion.git)
cd medilink-health-companion

# 2. Install dependencies
npm install

# 3. Environment Setup
# Create a .env file in the root directory and add your key:
# VITE_KEYWORDS_AI_KEY=your_keywords_ai_api_key_here

# 4. Start the development server
npm run dev
