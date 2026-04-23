import { Router, Request, Response } from 'express';

const router = Router();

// Get all components
router.get('/', (_req: Request, res: Response) => {
  res.json({ components: [] });
});

// Get component by ID
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ id, message: 'Component details' });
});

// Create component
router.post('/', (req: Request, res: Response) => {
  const data = req.body;
  res.status(201).json({ message: 'Component created', data });
});

// Update component
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  res.json({ message: 'Component updated', id, data });
});

// Delete component
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: 'Component deleted', id });
});

export default router;
