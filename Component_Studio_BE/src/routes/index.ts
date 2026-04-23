import { Router } from 'express';
import componentRoutes from './component.routes.js';

const router = Router();

router.use('/components', componentRoutes);

export default router;
