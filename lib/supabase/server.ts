import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// TODO: regenerar lib/types/database.types.ts a partir do schema real
// (npx supabase gen types typescript) e tipar este client com <Database>.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chamado a partir de um Server Component — o proxy.ts já
            // renova a sessão nesses casos, então é seguro ignorar.
          }
        },
      },
    },
  );
}
