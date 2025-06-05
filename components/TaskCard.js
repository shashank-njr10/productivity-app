import { useState } from 'react'
import Timer from './Timer'

export default function TaskCard({ task, onUpdate, onDelete }) {
  const [showTimer, setShowTimer] = useState(false)

  const handleComplete = async () => {
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !task.completed }),
      })
      onUpdate()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDelete = async () => {
    if (confirm('🗑️ Delete this mission? This action cannot be undone.')) {
      try {
        await fetch(`/api/tasks/${task.id}`, {
          method: 'DELETE'
        })
        onDelete(task.id)
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  const progressPercentage = ((task.estimatedHours - task.remainingHours) / task.estimatedHours) * 100

  // Dynamic status and styling based on progress
  const getTaskStatus = () => {
    if (task.completed) return { text: 'Mission Complete', emoji: '🏆', color: 'green' }
    if (progressPercentage >= 75) return { text: 'Almost There', emoji: '🎯', color: 'purple' }
    if (progressPercentage >= 50) return { text: 'Making Progress', emoji: '⚡', color: 'blue' }
    if (progressPercentage >= 25) return { text: 'Getting Started', emoji: '🚀', color: 'orange' }
    return { text: 'Ready to Launch', emoji: '💫', color: 'cyan' }
  }

  const status = getTaskStatus()

  return (
    <div className={`group relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
      task.completed ? 'opacity-75' : ''
    }`}>
      {/* Animated Gradient Border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      
      {/* Floating Status Indicator */}
      <div className="absolute -top-3 left-6 z-10">
        <div className={`px-3 py-1 rounded-full text-sm font-medium border backdrop-blur-sm transition-all duration-300 ${
          task.completed 
            ? 'bg-green-500/20 text-green-300 border-green-500/30' 
            : 'bg-violet-500/20 text-violet-300 border-violet-500/30'
        }`}>
          <span className="mr-1">{status.emoji}</span>
          {status.text}
        </div>
      </div>
      
      <div className="flex items-start justify-between mb-6 mt-4">
        <div className="flex-1">
          <h3 className={`text-xl font-bold mb-3 transition-all duration-300 ${
            task.completed 
              ? 'line-through text-white/50' 
              : 'text-white group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-cyan-400 group-hover:bg-clip-text group-hover:text-transparent'
          }`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-white/70 leading-relaxed text-base">{task.description}</p>
          )}
        </div>
        
        <button
          onClick={handleComplete}
          className={`ml-4 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
            task.completed 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25' 
              : 'bg-white/10 text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-500 hover:text-white border border-white/20 hover:border-green-500/50'
          }`}
        >
          {task.completed ? (
            <span className="flex items-center">
              <span className="mr-1">🏆</span>
              Complete
            </span>
          ) : (
            <span className="flex items-center">
              <span className="mr-1">✓</span>
              Mark Done
            </span>
          )}
        </button>
      </div>

      <div className="space-y-5">
        {/* Due Date with Enhanced Styling */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-base">
            <span className="text-white/60">📅</span>
            <span className="text-white/80 font-medium">
              Due: {new Date(task.targetDate).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
          
          {/* Time tracking info */}
          <div className="text-sm text-white/70 bg-white/5 px-3 py-1 rounded-lg border border-white/10">
            {task.remainingHours > 0 ? `${task.remainingHours.toFixed(1)}h left` : 'Time\'s up!'}
          </div>
        </div>

        {/* Progress Information */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-base">
            <span className="text-white/80 flex items-center font-medium">
              <span className="mr-2">⚡</span>
              Progress: {(task.estimatedHours - task.remainingHours).toFixed(1)}h / {task.estimatedHours}h
            </span>
            <span className="text-white/70 text-lg font-bold">
              {progressPercentage.toFixed(0)}%
            </span>
          </div>

          {/* Enhanced Progress Bar with Gradient */}
          <div className="relative">
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-shimmer"></div>
              </div>
            </div>
            {/* Progress markers */}
            <div className="absolute -top-1 left-0 w-full flex justify-between text-xs text-white/40">
              <div className="w-0.5 h-1 bg-white/40 rounded"></div>
              <div className="w-0.5 h-1 bg-white/40 rounded"></div>
              <div className="w-0.5 h-1 bg-white/40 rounded"></div>
              <div className="w-0.5 h-1 bg-white/40 rounded"></div>
              <div className="w-0.5 h-1 bg-white/40 rounded"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 text-sm rounded-full border border-cyan-500/30 hover:scale-105 transition-all duration-200 cursor-default backdrop-blur-sm font-medium"
              >
                <span className="mr-1">#</span>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons for Active Tasks */}
        {!task.completed && (
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowTimer(!showTimer)}
              className={`flex-1 px-5 py-3 rounded-xl font-medium text-base transition-all duration-300 hover:scale-105 ${
                showTimer
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25'
                  : 'bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40'
              }`}
            >
              <span className="flex items-center justify-center">
                <span className="mr-2 text-lg">
                  {showTimer ? '⏹️' : '▶️'}
                </span>
                {showTimer ? 'Hide Timer' : 'Start Focus'}
              </span>
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-3 bg-white/10 text-red-400 rounded-xl font-medium border border-red-500/30 hover:bg-red-500/20 hover:scale-105 transition-all duration-300 group"
            >
              <span className="group-hover:animate-bounce text-lg">🗑️</span>
            </button>
          </div>
        )}

        {/* Enhanced Timer Section */}
        {showTimer && (
          <div className="mt-6 animate-slideDown">
            <Timer 
              taskId={task.id} 
              onSessionComplete={(duration) => {
                setShowTimer(false)
                onUpdate()
              }} 
            />
          </div>
        )}

        {/* Completion Celebration for Completed Tasks */}
        {task.completed && (
          <div className="mt-4 p-5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl text-center">
            <div className="text-3xl mb-2">🎉</div>
            <p className="text-green-300 text-base font-semibold">Mission Accomplished!</p>
            <p className="text-green-400 text-sm mt-2">
              Completed in {(task.estimatedHours - task.remainingHours).toFixed(1)} hours
            </p>
          </div>
        )}
      </div>

      {/* Floating particles for active tasks */}
      {!task.completed && (
        <>
          <div className="absolute top-4 right-4 w-1 h-1 bg-violet-400 rounded-full opacity-40 group-hover:animate-ping"></div>
          <div className="absolute bottom-6 left-6 w-1 h-1 bg-cyan-400 rounded-full opacity-30 group-hover:animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-8 w-0.5 h-0.5 bg-blue-400 rounded-full opacity-50 group-hover:animate-ping" style={{ animationDelay: '0.5s' }}></div>
        </>
      )}
    </div>
  )
}