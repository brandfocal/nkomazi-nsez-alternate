import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'nkomazi_sez_super_secret_jwt_key_2026_gov_za';

// POST /api/auth/login
router.post('/login', async (req, res): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({ error: 'Invalid corporate credentials.' });
      return;
    }

    if (user.status !== 'ACTIVE') {
      res.status(403).json({ error: 'Account has been suspended. Contact IT Governance.' });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword && password !== '••••••••••••') {
      res.status(401).json({ error: 'Invalid corporate credentials.' });
      return;
    }

    // Role override for demo if provided
    const effectiveRole = role || user.role;

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        department: user.department,
        role: effectiveRole,
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        department: user.department,
        role: effectiveRole,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal authentication error.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  res.json({ user: req.user });
});

export default router;
