import { RequestHandler, Router } from 'express';
import {
  atualizarAbrigo,
  buscarAbrigoPorId,
  criarAbrigo,
  excluirAbrigo,
  listarAbrigos
} from '../controllers/AbrigoController';
import { authorize, protect } from '../middlewares/authMiddlaware';

const router = Router();

// Rotas públicas (não requerem autenticação)
router.get('/', listarAbrigos as RequestHandler);
router.get('/:id', buscarAbrigoPorId as RequestHandler);

// Rotas protegidas (requerem autenticação e autorização de 'administrador')
router.post('/', protect as RequestHandler, authorize('administrador') as RequestHandler, criarAbrigo as RequestHandler);
router.put('/:id', protect as RequestHandler, authorize('administrador') as RequestHandler, atualizarAbrigo as RequestHandler);
router.delete('/:id', protect as RequestHandler, authorize('administrador') as RequestHandler, excluirAbrigo as RequestHandler);

export default router;
