import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value; // Ambil token dari cookies
  const role = request.cookies.get("role")?.value; // Ambil role dari cookies

  const { pathname } = request.nextUrl; // URL dari halaman yang diminta

  // Daftar halaman yang diakses berdasarkan role
  const userRoutes = [
    "/cart",
    "/cart/:path*",
    "/profile",
    "/profile/:path*",
    "/my-transaction",
    "/my-transaction/:path*",
  ];
  const adminRoutes = ["/dashboard", "/dashboard/:path*", "/profile", "/profile/:path*"];

  // Jika tidak ada token, redirect ke halaman login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Logika untuk role 'user'
  if (role === "user") {
    if (!userRoutes.some((route) => pathname.startsWith(route))) {
      const homeUrl = new URL("/", request.url); // Redirect ke homepage jika akses halaman terlarang
      return NextResponse.redirect(homeUrl);
    }
  }

  // Logika untuk role 'admin'
  if (role === "admin") {
    if (!adminRoutes.some((route) => pathname.startsWith(route))) {
      const dashboardUrl = new URL("/", request.url); // Redirect ke dashboard jika akses halaman terlarang
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Jika role tidak valid atau tidak ditemukan, redirect ke login
  if (!role || (role !== "user" && role !== "admin")) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Jika semua validasi lolos, lanjutkan ke halaman yang diminta
  return NextResponse.next();
}

// Konfigurasi routes yang menggunakan middleware
export const config = {
  matcher: [
    "/cart",
    "/cart/:path*",
    "/profile",
    "/profile/:path*",
    "/my-transaction",
    "/my-transaction/:path*",
    "/dashboard",
    "/dashboard/:path*",
  ], // Path yang diprotect sesuai kebutuhan
};
