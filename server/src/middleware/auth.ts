import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'nkomazi_sez_super_secret_jwt_key_2026_gov_za';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  department: string;
  role: 'SUPER_ADMIN' | 'STANDARD_ADMIN';
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access denied. Missing bearer token.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid or expired session token.' });
  }
};

export const requireSuperAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'SUPER_ADMIN') {
    res.status(403).json({ 
      error: 'Permission denied. Super Administrator authorization required.' 
    });
    return;
  }
  next();
};
