import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <div className="text-white/70 text-sm">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 relative">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      
      {/* Subtle background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-white font-semibold text-lg">FlowTime</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/signin"
                className="text-white/70 hover:text-white transition-colors text-sm"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm backdrop-blur-sm border border-white/10"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Think better with
              <span className="block bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                FlowTime
              </span>
            </h1>
            
            <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
              Never skip a beat. Add a comment to an action to get everyone on the same page.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/auth/signup"
                className="bg-white text-slate-900 px-8 py-3 rounded-xl font-medium hover:bg-white/90 transition-all duration-200 text-lg"
              >
                Start for free
              </Link>
              <Link
                href="/auth/signin"
                className="text-white/70 hover:text-white transition-colors text-lg"
              >
                Sign in →
              </Link>
            </div>
          </div>

          {/* App Preview */}
          <div className="relative">
            {/* Glow effect behind the preview */}
            <div className="absolute inset-0 bg-gradient-to-t from-violet-500/20 to-blue-500/20 blur-3xl scale-110"></div>
            
            {/* Main preview container */}
            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="bg-slate-800/80 rounded-xl border border-white/10 p-6">
                {/* Mock window controls */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-white/40 text-sm">FlowTime Dashboard</div>
                  <div className="w-6"></div>
                </div>

                {/* Mock content */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">Daily Focus Zone</h3>
                    <div className="bg-violet-500/20 text-violet-300 px-3 py-1 rounded-lg text-sm">
                      3 active
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="text-white/60 text-sm mb-1">Total Tasks</div>
                      <div className="text-2xl font-bold text-white">12</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="text-white/60 text-sm mb-1">Completed</div>
                      <div className="text-2xl font-bold text-green-400">8</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="text-white/60 text-sm mb-1">In Progress</div>
                      <div className="text-2xl font-bold text-violet-400">4</div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-white font-medium">Design System Updates</div>
                      <div className="bg-violet-500/20 text-violet-300 px-2 py-1 rounded text-xs">
                        2.5h left
                      </div>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-violet-500 to-blue-500 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-white font-medium">API Documentation</div>
                      <div className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                        Complete
                      </div>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full w-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "⏱️",
              title: "Precise Timing",
              description: "Track every second of your focused work with precision timing."
            },
            {
              icon: "🔄",
              title: "Smart Rollover",
              description: "Never lose progress. Unfinished tasks roll to the next day automatically."
            },
            {
              icon: "📊",
              title: "Rich Analytics",
              description: "Understand your productivity patterns with detailed insights."
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-200">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}