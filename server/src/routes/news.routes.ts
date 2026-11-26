import { Router, Response } from 'express';
import { prisma } from '../db.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/news (Public / Admin)
router.get('/', async (req, res): Promise<void> => {
  try {
    const articles = await prisma.newsArticle.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(articles);
  } catch (error) {
    console.error('Fetch news error:', error);
    res.status(500).json({ error: 'Failed to retrieve news articles.' });
  }
});

// POST /api/news (Admin)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const article = await prisma.newsArticle.create({
      data: req.body
    });

    await prisma.auditLog.create({
      data: {
        action: 'PUBLISH_NEWS',
        target: article.title,
        userEmail: user.email,
        userName: user.name,
        role: user.role,
        timestamp: new Date().toISOString(),
        ipAddress: req.ip || '127.0.0.1'
      }
    });

    res.status(201).json(article);
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ error: 'Failed to publish news article.' });
  }
});

// PUT /api/news/:id (Admin)
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const article = await prisma.newsArticle.update({
      where: { id },
      data: req.body
    });
    res.json(article);
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ error: 'Failed to update article.' });
  }
});

// DELETE /api/news/:id (Admin)
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.newsArticle.delete({ where: { id } });
    res.json({ message: 'Article permanently deleted.' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ error: 'Failed to delete article.' });
  }
});

export default router;
