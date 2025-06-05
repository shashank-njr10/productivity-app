import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const userId = session.user.id

  if (req.method === 'GET') {
    try {
      const { date, view } = req.query
      let tasks

      if (view === 'daily' && date) {
        console.log('API: Fetching tasks for date:', date) // Debug log
        
        // Create start and end of day for the given date
        const targetDate = new Date(date + 'T00:00:00.000Z')
        const startOfDay = new Date(targetDate)
        startOfDay.setUTCHours(0, 0, 0, 0)
        
        const endOfDay = new Date(targetDate)
        endOfDay.setUTCHours(23, 59, 59, 999)
        
        console.log('API: Date range:', startOfDay.toISOString(), 'to', endOfDay.toISOString()) // Debug log
        
        tasks = await prisma.task.findMany({
          where: {
            userId,
            targetDate: {
              gte: startOfDay,
              lte: endOfDay
            }
          },
          include: {
            workSessions: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        })
        
        console.log('API: Found tasks:', tasks.length) // Debug log
      } else {
        // Weekly view - get tasks for the next 7 days
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const weekLater = new Date(today)
        weekLater.setDate(today.getDate() + 7)
        weekLater.setHours(23, 59, 59, 999)
        
        tasks = await prisma.task.findMany({
          where: {
            userId,
            targetDate: {
              gte: today,
              lte: weekLater
            }
          },
          include: {
            workSessions: true
          },
          orderBy: {
            targetDate: 'asc'
          }
        })
      }

      res.status(200).json(tasks)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      res.status(500).json({ message: 'Error fetching tasks' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, description, estimatedHours, targetDate, tags } = req.body

      if (!title || !estimatedHours || !targetDate) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      console.log('API: Creating task for date:', targetDate) // Debug log

      // Parse the date correctly
      const parsedDate = new Date(targetDate + 'T12:00:00.000Z') // Set to noon UTC to avoid timezone issues
      
      const task = await prisma.task.create({
        data: {
          title,
          description: description || '',
          estimatedHours: parseFloat(estimatedHours),
          remainingHours: parseFloat(estimatedHours),
          targetDate: parsedDate,
          tags: tags || [],
          userId
        }
      })

      console.log('API: Created task:', task.id, 'for date:', task.targetDate) // Debug log

      res.status(201).json(task)
    } catch (error) {
      console.error('Error creating task:', error)
      res.status(500).json({ message: 'Error creating task' })
    }
  }
}