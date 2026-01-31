# How to Find Your Keywords Agent ID

1. **Log in** to [Keywords AI Platform](https://platform.keywordsai.co/).
2. Go to the **Agents** tab (left sidebar).
3. **Click on your Agent** (or create a new one).
4. Look for the **Agent ID**. It is often shown:
   - Under the agent name at the top.
   - In the **Settings** tab.
   - In the browser URL: `.../agents/<YOUR_AGENT_ID>`

## Backend Setup
I have created a `.env` file in this directory.
1. Open `.env`.
2. Paste your `KEYWORDS_API_KEY` and `KEYWORDS_AGENT_ID` there.
3. Start the server:
   ```bash
   python3 -m uvicorn main:app --reload --env-file .env
   ```
