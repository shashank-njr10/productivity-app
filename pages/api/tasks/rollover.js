import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'
import { startOfDay, endOfDay, addDays, subDays } from 'date-fns'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const userId = session.user.id

  try {
    // Get yesterday's date
    const yesterday = subDays(new Date(), 1)
    
    // Find incomplete tasks from yesterday with remaining hours > 0
    const incompleteTasks = await prisma.task.findMany({
      where: {
        userId,
        targetDate: {
          gte: startOfDay(yesterday),
          lte: endOfDay(yesterday)
        },
        remainingHours: {
          gt: 0
        },
        completed: false
      }
    })

    console.log(`Found ${incompleteTasks.length} incomplete tasks from yesterday`)

    // Create new tasks for today with remaining hours
    const today = new Date()
    const rolledOverTasks = []

    for (const task of incompleteTasks) {
      const newTask = await prisma.task.create({
        data: {
          title: `${task.title} (Continued)`,
          description: task.description,
          estimatedHours: task.remainingHours,
          remainingHours: task.remainingHours,
          targetDate: today,
          tags: task.tags,
          userId
        }
      })
      rolledOverTasks.push(newTask)
    }

    console.log(`Rolled over ${rolledOverTasks.length} tasks to today`)

    res.status(200).json({ 
      message: `${rolledOverTasks.length} tasks rolled over from yesterday`,
      tasks: rolledOverTasks,
      originalTasks: incompleteTasks.length
    })
  } catch (error) {
    console.error('Rollover error:', error)
    res.status(500).json({ message: 'Error rolling over tasks' })
  }
}