import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Retorna o usuário autenticado apenas se ele for o dono (profiles.role='owner').
 * `null` em qualquer outro caso (não logado, logado mas não-dono).
 */
export async function getOwnerUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "owner") return null;

  return user;
}

/** Uso em Server Components de página: redireciona para /login se não for o dono. */
export async function requireOwnerPage() {
  const user = await getOwnerUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Uso dentro de Server Actions e funções de acesso a dados.
 * Cada Server Action é um endpoint POST alcançável diretamente — o
 * redirect da página não protege a action, então ela precisa reverificar
 * por conta própria (ver node_modules/next/dist/docs/01-app/02-guides/data-security.md).
 */
export async function requireOwnerAction() {
  const user = await getOwnerUser();
  if (!user) {
    throw new Error(
      "Não autorizado: apenas o proprietário pode executar esta ação.",
    );
  }
  return user;
}
