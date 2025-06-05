import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { id } = req.query
  const userId = session.user.id

  if (req.method === 'PUT') {
    try {
      const { completed, remainingHours } = req.body

      const task = await prisma.task.update({
        where: {
          id,
          userId
        },
        data: {
          completed,
          remainingHours: remainingHours !== undefined ? parseFloat(remainingHours) : undefined
        }
      })

      res.status(200).json(task)
    } catch (error) {
      console.error('Error updating task:', error)
      res.status(500).json({ message: 'Error updating task' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.task.delete({
        where: {
          id,
          userId
        }
      })

      res.status(200).json({ message: 'Task deleted' })
    } catch (error) {
      console.error('Error deleting task:', error)
      res.status(500).json({ message: 'Error deleting task' })
    }
  }
}