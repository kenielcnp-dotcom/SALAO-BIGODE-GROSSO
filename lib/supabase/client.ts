import { createBrowserClient } from "@supabase/ssr";

// TODO: regenerar lib/types/database.types.ts a partir do schema real
// (npx supabase gen types typescript) e tipar este client com <Database>.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
