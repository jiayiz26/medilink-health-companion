import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type PublicEnv = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PROJECT_ID?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  VITE_SUPABASE_ANON_KEY?: string;
};

let cachedClient: SupabaseClient | null = null;

function resolveBackendUrl(env: PublicEnv) {
  const direct = env.VITE_SUPABASE_URL?.trim();
  if (direct) return direct;

  // Fallback: Lovable Cloud project IDs map to https://<projectId>.supabase.co
  const projectId = env.VITE_SUPABASE_PROJECT_ID?.trim();
  if (projectId) return `https://${projectId}.supabase.co`;

  return "";
}

function resolveBackendKey(env: PublicEnv) {
  return (env.VITE_SUPABASE_PUBLISHABLE_KEY ?? env.VITE_SUPABASE_ANON_KEY ?? "").trim();
}

/**
 * Lazily creates the backend client so the app doesn't crash on boot if env vars
 * aren't injected yet (we only need the client when calling backend functions).
 */
export function getBackendClient(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const env = import.meta.env as unknown as PublicEnv;
  const url = resolveBackendUrl(env);
  const key = resolveBackendKey(env);

  if (!url) {
    throw new Error(
      "Backend URL is missing. Expected VITE_SUPABASE_URL (or VITE_SUPABASE_PROJECT_ID)."
    );
  }

  if (!key) {
    throw new Error(
      "Backend publishable key is missing. Expected VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY)."
    );
  }

  cachedClient = createClient(url, key, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return cachedClient;
}
