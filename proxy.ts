import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Next.js 16 renomeou middleware.ts -> proxy.ts (mesma API, export
// renomeado). Esta é a defesa PRINCIPAL de /admin/*: roda no servidor
// antes de qualquer render. app/admin/layout.tsx repete a checagem
// (defesa em profundidade) e o RLS do Supabase garante que, mesmo se
// isso aqui falhar, o banco recusa leitura/escrita de quem não é dono.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Propositalmente NÃO redireciona para /login: /admin só deve ser
    // alcançável por quem já conhece a URL de login direto (sem link
    // nenhum apontando pra lá). Quem tentar acessar /admin sem sessão
    // vê um 404 comum, sem indício de que existe uma área de gestão.
    const notFoundUrl = request.nextUrl.clone();
    notFoundUrl.pathname = "/admin-area-not-found";
    return NextResponse.rewrite(notFoundUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
