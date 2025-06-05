import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import CreateTaskForm from '../../components/CreateTaskForm'
import TaskCard from '../../components/TaskCard'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      checkAndRolloverTasks()
      fetchTasks()
    }
  }, [session])

  const fetchTasks = async () => {
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      const todayString = `${year}-${month}-${day}`
      
      console.log('Fetching tasks for date:', todayString) // Debug log
      
      const response = await fetch(`/api/tasks?view=daily&date=${todayString}`)
      if (response.ok) {
        const data = await response.json()
        console.log('Received tasks:', data) // Debug log
        setTasks(data)
      } else {
        console.error('Failed to fetch tasks:', response.status)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkAndRolloverTasks = async () => {
    try {
      const response = await fetch('/api/tasks/rollover', {
        method: 'POST'
      })
      if (response.ok) {
        const data = await response.json()
        if (data.tasks && data.tasks.length > 0) {
          showNotification(`🔄 ${data.tasks.length} tasks rolled over from yesterday!`)
          fetchTasks()
        }
      }
    } catch (error) {
      console.error('Error checking rollover:', error)
    }
  }

  const showNotification = (message) => {
    alert(message)
  }

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-violet-500"></div>
          <span className="ml-4 text-xl text-white">Loading your workspace...</span>
        </div>
      </Layout>
    )
  }

  if (!session) {
    return null
  }

  const completedTasks = tasks.filter(task => task.completed)
  const pendingTasks = tasks.filter(task => !task.completed)

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center py-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4 animate-fadeIn">
            Daily Focus Zone
          </h1>
          <p className="text-white/70 text-lg md:text-xl animate-fadeIn" style={{ animationDelay: '200ms' }}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2 animate-fadeIn" style={{ animationDelay: '400ms' }}>
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
            <span className="text-white/60 text-sm uppercase tracking-wider">
              Your productivity command center
            </span>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Futuristic Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              title: "Total Tasks", 
              value: tasks.length, 
              icon: "📊", 
              gradient: "from-blue-500 to-cyan-500",
              bgGradient: "from-blue-500/10 to-cyan-500/10",
              description: "In your pipeline"
            },
            { 
              title: "Completed", 
              value: completedTasks.length, 
              icon: "✅", 
              gradient: "from-green-500 to-emerald-500",
              bgGradient: "from-green-500/10 to-emerald-500/10",
              description: "Victory count"
            },
            { 
              title: "In Progress", 
              value: pendingTasks.length, 
              icon: "⚡", 
              gradient: "from-violet-500 to-pink-500",
              bgGradient: "from-violet-500/10 to-pink-500/10",
              description: "Active missions"
            }
          ].map((stat, index) => (
            <div 
              key={stat.title}
              className={`relative backdrop-blur-xl bg-gradient-to-br ${stat.bgGradient} border border-white/20 rounded-2xl p-6 group hover:scale-105 transition-all duration-300 hover:shadow-2xl animate-fadeIn`}
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/80 text-sm font-medium uppercase tracking-wider mb-1">
                    {stat.title}
                  </p>
                  <p className="text-white/60 text-xs">
                    {stat.description}
                  </p>
                </div>
                <div className={`text-4xl opacity-80 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
              </div>
              
              <div className="flex items-end justify-between">
                <p className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
                <div className={`w-12 h-1 bg-gradient-to-r ${stat.gradient} rounded-full opacity-60`}></div>
              </div>
              
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`}></div>
              
              <div className="absolute top-4 right-4 w-1 h-1 bg-white rounded-full opacity-40 group-hover:animate-ping"></div>
              <div className="absolute bottom-6 left-6 w-1 h-1 bg-white rounded-full opacity-30 group-hover:animate-ping" style={{ animationDelay: '1s' }}></div>
            </div>
          ))}
        </div>

        {/* Enhanced Add Task Form */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 animate-fadeIn" style={{ animationDelay: '600ms' }}>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
              <span className="mr-3 text-2xl">🚀</span>
              Create New Mission
            </h3>
            <p className="text-white/60 text-sm">Define your next achievement and track every second of progress</p>
          </div>
          <CreateTaskForm onTaskCreated={fetchTasks} />
        </div>

        {/* Task Sections with Enhanced Animations */}
        {pendingTasks.length > 0 && (
          <div className="space-y-6 animate-fadeIn" style={{ animationDelay: '800ms' }}>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl animate-pulse">🔥</span>
                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Active Missions
                </h3>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-orange-500/50 via-red-500/50 to-transparent"></div>
              <div className="text-white/70 text-sm bg-white/5 px-3 py-1 rounded-full border border-white/10">
                {pendingTasks.length} active
              </div>
            </div>
            <div className="grid gap-6">
              {pendingTasks.map((task, index) => (
                <div 
                  key={task.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${(index * 100) + 1000}ms` }}
                >
                  <TaskCard
                    task={task}
                    onUpdate={fetchTasks}
                    onDelete={handleDeleteTask}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {completedTasks.length > 0 && (
          <div className="space-y-6 animate-fadeIn" style={{ animationDelay: '1200ms' }}>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">✨</span>
                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Victory Archive
                </h3>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-green-500/50 via-emerald-500/50 to-transparent"></div>
              <div className="text-white/70 text-sm bg-white/5 px-3 py-1 rounded-full border border-white/10">
                {completedTasks.length} completed
              </div>
            </div>
            <div className="grid gap-6">
              {completedTasks.map((task, index) => (
                <div 
                  key={task.id}
                  className="animate-fadeIn opacity-75 hover:opacity-100 transition-opacity duration-300"
                  style={{ animationDelay: `${(index * 50) + 1400}ms` }}
                >
                  <TaskCard
                    task={task}
                    onUpdate={fetchTasks}
                    onDelete={handleDeleteTask}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Empty State */}
        {tasks.length === 0 && (
          <div className="text-center py-20 animate-fadeIn" style={{ animationDelay: '800ms' }}>
            <div className="relative">
              <div className="text-8xl md:text-9xl mb-6 animate-bounce">🚀</div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-violet-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              Ready to Launch?
            </h3>
            <p className="text-white/60 text-lg md:text-xl mb-8 max-w-md mx-auto">
              Your productivity command center is waiting. Create your first mission and start tracking every second of progress!
            </p>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-ping"></div>
              <span className="text-white/50 text-sm uppercase tracking-widest">Initialize workflow</span>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></div>
            </div>
          </div>
        )}

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 left-4 bg-black/50 text-white/70 text-xs p-2 rounded">
            Debug: {tasks.length} tasks loaded for {new Date().toISOString().split('T')[0]}
          </div>
        )}
      </div>
    </Layout>
  )
}