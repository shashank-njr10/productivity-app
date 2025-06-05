import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const userId = session.user.id

  if (req.method === 'POST') {
    try {
      const { taskId, startTime, endTime, duration } = req.body

      if (!taskId || !startTime || !duration) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      // Create work session
      const workSession = await prisma.workSession.create({
        data: {
          taskId,
          userId,
          startTime: new Date(startTime),
          endTime: endTime ? new Date(endTime) : null,
          duration: parseFloat(duration)
        }
      })

      // Update task remaining hours
      const task = await prisma.task.findUnique({
        where: { id: taskId }
      })

      if (task) {
        const newRemainingHours = Math.max(0, task.remainingHours - parseFloat(duration))
        
        await prisma.task.update({
          where: { id: taskId },
          data: {
            remainingHours: newRemainingHours,
            completed: newRemainingHours === 0 ? true : task.completed
          }
        })
      }

      res.status(201).json(workSession)
    } catch (error) {
      console.error('Error creating work session:', error)
      res.status(500).json({ message: 'Error creating work session' })
    }
  }

  if (req.method === 'GET') {
    try {
      const { taskId } = req.query
      
      const sessions = await prisma.workSession.findMany({
        where: {
          userId,
          ...(taskId && { taskId })
        },
        include: {
          task: {
            select: {
              title: true
            }
          }
        },
        orderBy: {
          startTime: 'desc'
        }
      })

      res.status(200).json(sessions)
    } catch (error) {
      console.error('Error fetching work sessions:', error)
      res.status(500).json({ message: 'Error fetching work sessions' })
    }
  }
}