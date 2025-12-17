import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

export const supabase = createClient(
 `${process.env.SUPABASE_URL}`,
  `${process.env.SUPABASE_ANON_KEY}`,
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
