import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const userId = session.user.id

  try {
    const now = new Date()
    
    // This week's stats (last 7 days)
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const weeklyWorkSessions = await prisma.workSession.findMany({
      where: {
        userId,
        startTime: {
          gte: weekAgo
        }
      }
    })

    const weeklyHours = weeklyWorkSessions.reduce((total, session) => total + session.duration, 0)

    // This month's stats (last 30 days)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const monthlyWorkSessions = await prisma.workSession.findMany({
      where: {
        userId,
        startTime: {
          gte: monthAgo
        }
      }
    })

    const monthlyHours = monthlyWorkSessions.reduce((total, session) => total + session.duration, 0)

    // Completed tasks this week
    const completedTasksThisWeek = await prisma.task.count({
      where: {
        userId,
        completed: true,
        updatedAt: {
          gte: weekAgo
        }
      }
    })

    // Total tasks
    const totalTasks = await prisma.task.count({
      where: { userId }
    })

    const completedTasks = await prisma.task.count({
      where: { userId, completed: true }
    })

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    res.status(200).json({
      weeklyHours: parseFloat(weeklyHours.toFixed(2)),
      monthlyHours: parseFloat(monthlyHours.toFixed(2)),
      completedTasksThisWeek,
      totalTasks,
      completedTasks,
      completionRate: parseFloat(completionRate.toFixed(1))
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({ message: 'Error fetching stats' })
  }
}