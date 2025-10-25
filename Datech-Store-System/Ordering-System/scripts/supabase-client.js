import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

export const supabase = createClient(
  "https://fqfvvdqboxjiyxhfhymf.supabase.co",
  "REMOVED"
)

const currentSession = await supabase.auth.getSession();

export function getSession () { 
  const session = currentSession.data.session;
  return session;
}

