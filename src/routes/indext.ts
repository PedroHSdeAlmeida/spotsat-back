import { Router } from 'express';
import loginRoutes from './loginRoutes';
import polygonRoutes from './polygonRoutes';


const router = Router();

router.use('/login', loginRoutes);
router.use('/polygons', polygonRoutes);

export default router;