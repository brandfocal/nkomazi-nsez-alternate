import { Router, Response } from 'express';
import { prisma } from '../db.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/resources (Public / Admin)
router.get('/', async (req, res): Promise<void> => {
  try {
    const resources = await prisma.resourceDoc.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(resources);
  } catch (error) {
    console.error('Fetch resources error:', error);
    res.status(500).json({ error: 'Failed to retrieve investor resources.' });
  }
});

// POST /api/resources (Admin)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const resource = await prisma.resourceDoc.create({
      data: req.body
    });

    await prisma.auditLog.create({
      data: {
        action: 'UPLOAD_RESOURCE',
        target: resource.title,
        userEmail: user.email,
        userName: user.name,
        role: user.role,
        timestamp: new Date().toISOString(),
        ipAddress: req.ip || '127.0.0.1'
      }
    });

    res.status(201).json(resource);
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ error: 'Failed to save investor document.' });
  }
});

// DELETE /api/resources/:id (Admin)
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const resource = await prisma.resourceDoc.findUnique({ where: { id } });
    if (!resource) {
      res.status(404).json({ error: 'Resource not found.' });
      return;
    }

    if (user.role === 'SUPER_ADMIN') {
      await prisma.resourceDoc.delete({ where: { id } });
      res.json({ message: 'Resource permanently deleted.' });
      return;
    }

    // Standard Admin queues deletion
    await prisma.approvalRequest.create({
      data: {
        itemType: 'RESOURCE',
        itemId: id,
        itemTitle: resource.title,
        action: 'DELETE',
        requestedBy: `${user.name} (${user.email})`,
        requestedAt: new Date().toISOString(),
        reason: 'Standard Admin requested deletion of document.',
        status: 'PENDING'
      }
    });

    res.json({ message: 'Deletion queued for Super Admin approval.', status: 'PENDING_APPROVAL' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ error: 'Failed to process deletion request.' });
  }
});

export default router;
