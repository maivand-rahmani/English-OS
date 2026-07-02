export { auth as proxy } from "@/server/auth";

export const proxyConfig = {
  matcher: [
    "/dashboard/:path*",
    "/roadmap/:path*",
    "/resources/:path*",
    "/practice/:path*",
    "/writing/:path*",
    "/speaking/:path*",
    "/settings/:path*",
  ],
};
