import { Router, Response } from 'express';
import { prisma } from '../db.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/inquiries (Admin)
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(inquiries);
  } catch (error) {
    console.error('Fetch inquiries error:', error);
    res.status(500).json({ error: 'Failed to retrieve inquiries.' });
  }
});

// POST /api/inquiries (Public Contact & Enterprise Hub forms)
router.post('/', async (req, res): Promise<void> => {
  try {
    const { type, name, email, phone, company, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required.' });
      return;
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        type: type || 'GENERAL_CONTACT',
        name,
        email,
        phone: phone || '',
        company: company || '',
        message,
        status: 'NEW'
      }
    });

    res.status(201).json({
      message: 'Your inquiry has been received by Mpumalanga Nkomazi SEZ administration.',
      inquiryId: inquiry.id
    });
  } catch (error) {
    console.error('Submit inquiry error:', error);
    res.status(500).json({ error: 'Failed to submit inquiry.' });
  }
});

// PATCH /api/inquiries/:id/status (Admin)
router.patch('/:id/status', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.inquiry.update({
      where: { id },
      data: { status }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update inquiry status error:', error);
    res.status(500).json({ error: 'Failed to update inquiry status.' });
  }
});

export default router;
