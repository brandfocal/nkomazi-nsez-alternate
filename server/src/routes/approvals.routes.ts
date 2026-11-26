import { Router, Response } from 'express';
import { prisma } from '../db.js';
import { authenticateToken, requireSuperAdmin, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/approvals (Admin)
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const status = req.query.status as any;
    const where = status ? { status } : {};
    const requests = await prisma.approvalRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    res.json(requests);
  } catch (error) {
    console.error('Fetch approvals error:', error);
    res.status(500).json({ error: 'Failed to retrieve approval queue.' });
  }
});

// POST /api/approvals/:id/approve (Super Admin only)
router.post('/:id/approve', authenticateToken, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const user = req.user!;

    const approval = await prisma.approvalRequest.findUnique({ where: { id } });
    if (!approval) {
      res.status(404).json({ error: 'Approval request not found.' });
      return;
    }

    if (approval.status !== 'PENDING') {
      res.status(400).json({ error: 'Request is already processed.' });
      return;
    }

    // Execute the approved action
    if (approval.action === 'DELETE') {
      if (approval.itemType === 'OPPORTUNITY') {
        await prisma.investmentListing.delete({ where: { id: approval.itemId } }).catch(() => {});
      } else if (approval.itemType === 'TENDER') {
        await prisma.tender.delete({ where: { id: approval.itemId } }).catch(() => {});
      } else if (approval.itemType === 'RESOURCE') {
        await prisma.resourceDoc.delete({ where: { id: approval.itemId } }).catch(() => {});
      }
    }

    const updated = await prisma.approvalRequest.update({
      where: { id },
      data: {
        status: 'APPROVED',
        reviewedBy: `${user.name} (${user.email})`,
        reviewedAt: new Date().toISOString()
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'APPROVE_REQUEST',
        target: approval.itemTitle,
        userEmail: user.email,
        userName: user.name,
        role: user.role,
        timestamp: new Date().toISOString(),
        ipAddress: req.ip || '127.0.0.1',
        details: `Approved ${approval.action} for ${approval.itemType}`
      }
    });

    res.json({ message: 'Request approved and executed successfully.', approval: updated });
  } catch (error) {
    console.error('Approve error:', error);
    res.status(500).json({ error: 'Failed to approve request.' });
  }
});

// POST /api/approvals/:id/reject (Super Admin only)
router.post('/:id/reject', authenticateToken, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const user = req.user!;

    const approval = await prisma.approvalRequest.findUnique({ where: { id } });
    if (!approval) {
      res.status(404).json({ error: 'Approval request not found.' });
      return;
    }

    // Revert item status back to normal
    if (approval.itemType === 'OPPORTUNITY') {
      await prisma.investmentListing.update({
        where: { id: approval.itemId },
        data: { status: 'PUBLISHED' }
      }).catch(() => {});
    } else if (approval.itemType === 'TENDER') {
      await prisma.tender.update({
        where: { id: approval.itemId },
        data: { status: 'OPEN' }
      }).catch(() => {});
    }

    const updated = await prisma.approvalRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        reviewedBy: `${user.name} (${user.email})`,
        reviewedAt: new Date().toISOString()
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'REJECT_REQUEST',
        target: approval.itemTitle,
        userEmail: user.email,
        userName: user.name,
        role: user.role,
        timestamp: new Date().toISOString(),
        ipAddress: req.ip || '127.0.0.1'
      }
    });

    res.json({ message: 'Request rejected. Item restored.', approval: updated });
  } catch (error) {
    console.error('Reject error:', error);
    res.status(500).json({ error: 'Failed to reject request.' });
  }
});

export default router;
