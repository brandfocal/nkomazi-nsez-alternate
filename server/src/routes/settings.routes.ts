import { Router, Response } from 'express';
import { prisma } from '../db.js';
import { authenticateToken, requireSuperAdmin, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/settings (Public / Admin)
router.get('/', async (req, res): Promise<void> => {
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          primaryPhone: '+27 (0) 13 752 4000',
          primaryEmail: 'info@nkomazisez.co.za',
          physicalAddress: 'Nkomazi SEZ Precinct, Komatipoort / Lebombo Border Corridor, Mpumalanga, 1340',
          officeHours: 'Monday – Friday: 08:00 – 16:30 CAT',
          linkedinUrl: 'https://linkedin.com/company/nkomazi-sez',
          twitterUrl: 'https://x.com/NkomaziSEZ',
          alertBannerText: 'Official Notice: RFP NSEZ/ENG/2026/020 is open for submission.',
          alertBannerActive: true
        }
      });
    }
    res.json(settings);
  } catch (error) {
    console.error('Fetch settings error:', error);
    res.status(500).json({ error: 'Failed to retrieve site settings.' });
  }
});

// PUT /api/settings (Super Admin only)
router.put('/', authenticateToken, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const settings = await prisma.siteSettings.findFirst();

    let updated;
    if (settings) {
      updated = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: req.body
      });
    } else {
      updated = await prisma.siteSettings.create({
        data: req.body
      });
    }

    await prisma.auditLog.create({
      data: {
        action: 'UPDATE_SITE_SETTINGS',
        target: 'Public Contact & Site Directory',
        userEmail: user.email,
        userName: user.name,
        role: user.role,
        timestamp: new Date().toISOString(),
        ipAddress: req.ip || '127.0.0.1'
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update site settings.' });
  }
});

export default router;
