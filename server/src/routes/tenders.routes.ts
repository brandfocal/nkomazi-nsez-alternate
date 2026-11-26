import { Router, Response } from 'express';
import { prisma } from '../db.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/tenders (Public & Admin)
router.get('/', async (req, res): Promise<void> => {
  try {
    const status = req.query.status as string;
    const where = status ? { status: status as any } : {};
    const tenders = await prisma.tender.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    res.json(tenders);
  } catch (error) {
    console.error('Fetch tenders error:', error);
    res.status(500).json({ error: 'Failed to retrieve tenders.' });
  }
});

// POST /api/tenders (Admin)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const tender = await prisma.tender.create({
      data: {
        ...req.body,
        status: 'OPEN'
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'CREATE_TENDER',
        target: `${tender.refNo} - ${tender.title}`,
        userEmail: user.email,
        userName: user.name,
        role: user.role,
        timestamp: new Date().toISOString(),
        ipAddress: req.ip || '127.0.0.1'
      }
    });

    res.status(201).json(tender);
  } catch (error) {
    console.error('Create tender error:', error);
    res.status(500).json({ error: 'Failed to create tender.' });
  }
});

// PUT /api/tenders/:id (Admin)
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const user = req.user!;

    const updated = await prisma.tender.update({
      where: { id },
      data: req.body
    });

    await prisma.auditLog.create({
      data: {
        action: 'UPDATE_TENDER',
        target: `${updated.refNo} - ${updated.title}`,
        userEmail: user.email,
        userName: user.name,
        role: user.role,
        timestamp: new Date().toISOString(),
        ipAddress: req.ip || '127.0.0.1'
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update tender error:', error);
    res.status(500).json({ error: 'Failed to update tender.' });
  }
});

// POST /api/tenders/:id/delete (Super Admin vs Standard Admin)
router.post('/:id/delete', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const user = req.user!;
    const { reason } = req.body;

    const tender = await prisma.tender.findUnique({ where: { id } });
    if (!tender) {
      res.status(404).json({ error: 'Tender not found.' });
      return;
    }

    if (user.role === 'SUPER_ADMIN') {
      await prisma.tender.delete({ where: { id } });

      await prisma.auditLog.create({
        data: {
          action: 'DELETE_TENDER_PERMANENT',
          target: `${tender.refNo} - ${tender.title}`,
          userEmail: user.email,
          userName: user.name,
          role: user.role,
          timestamp: new Date().toISOString(),
          ipAddress: req.ip || '127.0.0.1',
          details: 'Super Admin direct deletion'
        }
      });

      res.json({ message: 'Tender permanently removed.', status: 'DELETED' });
      return;
    }

    // Standard Admin queue
    await prisma.tender.update({
      where: { id },
      data: { status: 'PENDING_DELETION' }
    });

    const approvalReq = await prisma.approvalRequest.create({
      data: {
        itemType: 'TENDER',
        itemId: id,
        itemTitle: `${tender.refNo}: ${tender.title}`,
        action: 'DELETE',
        requestedBy: `${user.name} (${user.email})`,
        requestedAt: new Date().toISOString(),
        reason: reason || 'Standard Admin requested deletion of tender.',
        status: 'PENDING'
      }
    });

    res.json({
      message: 'Deletion queued for Super Admin approval.',
      status: 'PENDING_APPROVAL',
      approvalRequest: approvalReq
    });
  } catch (error) {
    console.error('Delete tender error:', error);
    res.status(500).json({ error: 'Failed to process tender deletion request.' });
  }
});

export default router;
