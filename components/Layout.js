import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Layout({ children }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    {
      name: "Daily Focus",
      href: "/dashboard",
      icon: "⚡",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      name: "Weekly Flow",
      href: "/dashboard/weekly",
      icon: "🌊",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      name: "Analytics",
      href: "/dashboard/stats",
      icon: "📈",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: "👤",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Modern Glassmorphism Navigation */}
      <nav className="relative z-50 backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
              >
                ⚡ FlowTime
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    router.pathname === item.href
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-purple-500/25`
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </span>
                  {router.pathname === item.href && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse"></div>
                  )}
                </Link>
              ))}

              <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                    {session?.user?.name?.[0] ||
                      session?.user?.email?.[0] ||
                      "U"}
                  </div>
                  <span className="text-sm text-gray-300 hidden lg:block">
                    {session?.user?.name || session?.user?.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                >
                  <span className="mr-1">🚪</span>
                  Exit
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      router.pathname === item.href
                        ? `bg-gradient-to-r ${item.gradient} text-white`
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="flex items-center space-x-3">
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.name}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
