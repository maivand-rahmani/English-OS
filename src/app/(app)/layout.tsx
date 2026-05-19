import { auth } from "@/server/auth";
import { AppShell } from "@/widgets/app-shell";

export default async function AuthenticatedAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userLabel = session?.user?.email ?? session?.user?.name ?? "Guest mode";

  return <AppShell userLabel={userLabel}>{children}</AppShell>;
}
