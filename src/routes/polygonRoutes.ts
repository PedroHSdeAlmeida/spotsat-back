import { Router } from 'express';
import { PoligonoController } from '../controller';
import { authenticateJWT } from '../middlewares';

const router = Router();

router.post('/', authenticateJWT, PoligonoController.criarPoligono);
router.get('/', authenticateJWT, PoligonoController.listarPoligonos);
router.get('/search', authenticateJWT, PoligonoController.buscarPoligonos);
router.get('/:id', authenticateJWT, PoligonoController.obterPoligono);
router.get('/:id/interests', authenticateJWT, PoligonoController.obterPoligonosDentroDoPoligono);
router.put('/:id', authenticateJWT, PoligonoController.atualizarPoligono);
router.delete('/:id', authenticateJWT, PoligonoController.deletarPoligono);

export default router;
