import { Router, RequestHandler } from 'express';
import {
  criarAdocao,
  listarAdocoes,
  buscarAdocaoPorId,
  atualizarAdocao,
  excluirAdocao
} from '../controllers/AdocaoController';
import { authorize, protect } from '../middlewares/authMiddlaware';

const router = Router();

// Todas as rotas de adoção requerem autenticação e autorização de 'administrador'
router.post('/', protect as RequestHandler, authorize('administrador') as RequestHandler, criarAdocao as RequestHandler);
router.get('/', protect as RequestHandler, authorize('administrador') as RequestHandler, listarAdocoes as RequestHandler);
router.get('/:id', protect as RequestHandler, authorize('administrador') as RequestHandler, buscarAdocaoPorId as RequestHandler);
router.put('/:id', protect as RequestHandler, authorize('administrador') as RequestHandler, atualizarAdocao as RequestHandler);
router.delete('/:id', protect as RequestHandler, authorize('administrador') as RequestHandler, excluirAdocao as RequestHandler);

export default router;
