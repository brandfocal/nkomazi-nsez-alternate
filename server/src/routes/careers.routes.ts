import { Router, Response } from 'express';
import { prisma } from '../db.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/careers (Public / Admin)
router.get('/', async (req, res): Promise<void> => {
  try {
    const careers = await prisma.careerOpening.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(careers);
  } catch (error) {
    console.error('Fetch careers error:', error);
    res.status(500).json({ error: 'Failed to retrieve career listings.' });
  }
});

// POST /api/careers (Admin)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const career = await prisma.careerOpening.create({
      data: req.body
    });

    await prisma.auditLog.create({
      data: {
        action: 'POST_CAREER',
        target: `${career.title} (${career.type})`,
        userEmail: user.email,
        userName: user.name,
        role: user.role,
        timestamp: new Date().toISOString(),
        ipAddress: req.ip || '127.0.0.1'
      }
    });

    res.status(201).json(career);
  } catch (error) {
    console.error('Create career error:', error);
    res.status(500).json({ error: 'Failed to post career opening.' });
  }
});

// PUT /api/careers/:id (Admin)
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const updated = await prisma.careerOpening.update({
      where: { id },
      data: req.body
    });
    res.json(updated);
  } catch (error) {
    console.error('Update career error:', error);
    res.status(500).json({ error: 'Failed to update career opening.' });
  }
});

// DELETE /api/careers/:id (Admin)
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.careerOpening.delete({ where: { id } });
    res.json({ message: 'Career opening permanently removed.' });
  } catch (error) {
    console.error('Delete career error:', error);
    res.status(500).json({ error: 'Failed to delete career opening.' });
  }
});

export default router;
