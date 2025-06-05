import { useState } from 'react'

export default function CreateTaskForm({ onTaskCreated }) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Fix: Get today's date in local timezone
  const getTodayDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimatedHours: '',
    targetDate: getTodayDate(),
    tags: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        }),
      })

      if (response.ok) {
        setFormData({
          title: '',
          description: '',
          estimatedHours: '',
          targetDate: getTodayDate(),
          tags: ''
        })
        setIsOpen(false)
        onTaskCreated()
        alert('🚀 Mission created successfully!')
      } else {
        alert('❌ Error creating task')
      }
    } catch (error) {
      console.error('Error creating task:', error)
      alert('❌ Error creating task')
    }
  }

  if (!isOpen) {
    return (
      <div className="group relative">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full p-8 border-2 border-dashed border-white/30 rounded-2xl text-white hover:text-white hover:border-violet-500/50 transition-all duration-300 bg-white/5 hover:bg-white/10 backdrop-blur-sm group-hover:scale-[1.02]"
        >
          <div className="flex items-center justify-center space-x-4">
            <span className="text-3xl group-hover:animate-bounce">🚀</span>
            <div className="text-center">
              <div className="text-xl font-semibold">Launch New Mission</div>
              <div className="text-sm text-white/60 mt-2">Click to define your next achievement</div>
            </div>
            <span className="text-3xl group-hover:animate-bounce delay-100">⚡</span>
          </div>
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
          🎯 Mission Control
        </h3>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-white/60 hover:text-white transition-colors text-xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
        >
          ✕
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-base font-medium text-white mb-3">
            🎯 Mission Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-base placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
            placeholder="What's your mission?"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-base font-medium text-white mb-3">
            📝 Mission Brief
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-base placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 resize-none"
            rows={4}
            placeholder="Describe your mission objectives..."
          />
        </div>

        <div>
          <label className="block text-base font-medium text-white mb-3">
            ⏱️ Time Investment *
          </label>
          <input
            type="number"
            step="0.5"
            min="0.5"
            required
            value={formData.estimatedHours}
            onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
            className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-base placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
            placeholder="2.5"
          />
          <p className="text-sm text-white/60 mt-2">Hours needed to complete</p>
        </div>

        <div>
          <label className="block text-base font-medium text-white mb-3">
            📅 Target Date *
          </label>
          <input
            type="date"
            required
            value={formData.targetDate}
            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-base focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
          />
          <p className="text-sm text-white/60 mt-2">When do you want to complete this?</p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-base font-medium text-white mb-3">
            🏷️ Mission Tags
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="work, personal, urgent"
            className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-base placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
          />
          <p className="text-sm text-white/60 mt-2">Separate tags with commas (optional)</p>
        </div>
      </div>

      <div className="flex space-x-4 pt-6">
        <button
          type="submit"
          className="flex-1 px-6 py-4 bg-gradient-to-r from-violet-500 to-blue-500 text-white text-lg font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
        >
          <span className="flex items-center justify-center">
            <span className="mr-2 text-xl">🚀</span>
            Launch Mission
          </span>
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-6 py-4 bg-white/10 text-white text-base font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}