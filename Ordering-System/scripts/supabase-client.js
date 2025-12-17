import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

export const supabase = createClient(
  "https://fqfvvdqboxjiyxhfhymf.supabase.co",
  "REMOVED",
   {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    }
  }
)

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) { 
    console.error(error.message)
  } else {
    return data.session;
  }
}
