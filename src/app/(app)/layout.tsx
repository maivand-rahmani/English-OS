import { auth } from "@/server/auth";
import { AppShell } from "@/widgets/app-shell";

export default async function AuthenticatedAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const account = {
    displayName:
      session?.user?.name ?? session?.user?.email ?? "Guest mode",
    email: session?.user?.email ?? null,
    isAuthenticated: Boolean(session?.user),
  };

  return <AppShell account={account}>{children}</AppShell>;
}
