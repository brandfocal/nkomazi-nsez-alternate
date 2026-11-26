import { Router, Response } from 'express';
import { prisma } from '../db.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/listings (Public / Admin)
router.get('/', async (req, res): Promise<void> => {
  try {
    const status = req.query.status as string;
    const where = status ? { status: status as any } : {};
    const listings = await prisma.investmentListing.findMany({
      where,
      orderBy: { updatedAt: 'desc' }
    });
    res.json(listings);
  } catch (error) {
    console.error('Fetch listings error:', error);
    res.status(500).json({ error: 'Failed to retrieve investment opportunities.' });
  }
});

// POST /api/listings (Admin)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const listing = await prisma.investmentListing.create({
      data: {
        ...req.body,
        status: 'PUBLISHED'
      }
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE_OPPORTUNITY',
        target: listing.title,
        userEmail: user.email,
        userName: user.name,
        role: user.role,
        timestamp: new Date().toISOString(),
        ipAddress: req.ip || '127.0.0.1',
        details: `Created listing value ${listing.value}`
      }
    });

    res.status(201).json(listing);
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ error: 'Failed to create investment opportunity.' });
  }
});

// PUT /api/listings/:id (Admin)
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const user = req.user!;

    const updated = await prisma.investmentListing.update({
      where: { id },
      data: req.body
    });

    await prisma.auditLog.create({
      data: {
        action: 'UPDATE_OPPORTUNITY',
        target: updated.title,
        userEmail: user.email,
        userName: user.name,
        role: user.role,
        timestamp: new Date().toISOString(),
        ipAddress: req.ip || '127.0.0.1'
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ error: 'Failed to update investment opportunity.' });
  }
});

// POST /api/listings/:id/delete (Super Admin vs Standard Admin)
router.post('/:id/delete', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const user = req.user!;
    const { reason } = req.body;

    const listing = await prisma.investmentListing.findUnique({ where: { id } });
    if (!listing) {
      res.status(404).json({ error: 'Listing not found.' });
      return;
    }

    // IF SUPER ADMIN: Delete immediately
    if (user.role === 'SUPER_ADMIN') {
      await prisma.investmentListing.delete({ where: { id } });

      await prisma.auditLog.create({
        data: {
          action: 'DELETE_OPPORTUNITY_PERMANENT',
          target: listing.title,
          userEmail: user.email,
          userName: user.name,
          role: user.role,
          timestamp: new Date().toISOString(),
          ipAddress: req.ip || '127.0.0.1',
          details: 'Direct Super Admin deletion'
        }
      });

      res.json({ message: 'Listing permanently deleted.', status: 'DELETED' });
      return;
    }

    // IF STANDARD ADMIN: Queue in Approval Center
    await prisma.investmentListing.update({
      where: { id },
      data: { status: 'PENDING_DELETION' }
    });

    const approvalReq = await prisma.approvalRequest.create({
      data: {
        itemType: 'OPPORTUNITY',
        itemId: id,
        itemTitle: listing.title,
        action: 'DELETE',
        requestedBy: `${user.name} (${user.email})`,
        requestedAt: new Date().toISOString(),
        reason: reason || 'Standard Admin requested deletion.',
        status: 'PENDING'
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'REQUEST_DELETE_OPPORTUNITY',
        target: listing.title,
        userEmail: user.email,
        userName: user.name,
        role: user.role,
        timestamp: new Date().toISOString(),
        ipAddress: req.ip || '127.0.0.1',
        details: reason
      }
    });

    res.json({
      message: 'Deletion submitted to Super Admin approval queue.',
      status: 'PENDING_APPROVAL',
      approvalRequest: approvalReq
    });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ error: 'Failed to process deletion request.' });
  }
});

export default router;
