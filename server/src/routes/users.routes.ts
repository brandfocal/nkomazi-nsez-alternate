import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../db.js';
import { authenticateToken, requireSuperAdmin, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/users (Super Admin only)
router.get('/', authenticateToken, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        department: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' }
    });
    res.json(users);
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ error: 'Failed to retrieve admin users.' });
  }
});

// POST /api/users (Super Admin only)
router.post('/', authenticateToken, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password, name, department, role } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password, and name are required.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        department: department || 'Operations',
        role: role || 'STANDARD_ADMIN',
        status: 'ACTIVE'
      },
      select: {
        id: true,
        email: true,
        name: true,
        department: true,
        role: true,
        status: true,
        createdAt: true
      }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to provision admin user.' });
  }
});

export default router;
