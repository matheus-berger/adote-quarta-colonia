import { Router, RequestHandler } from 'express'; // Importa RequestHandler para tipagem
import {
  criarAdotante,
  listarAdotantes,
  buscarAdotantePorId,
  atualizarAdotante,
  excluirAdotante
} from '../controllers/AdotanteController';
import { authorize, protect } from '../middlewares/authMiddlaware';

const router = Router();

// Rotas públicas
router.get('/', listarAdotantes as RequestHandler);
router.get('/:id', buscarAdotantePorId as RequestHandler);

// Rotas protegidas (requerem autenticação e autorização de 'administrador')
router.post('/', protect as RequestHandler, authorize('administrador') as RequestHandler, criarAdotante as RequestHandler);
router.put('/:id', protect as RequestHandler, authorize('administrador') as RequestHandler, atualizarAdotante as RequestHandler);
router.delete('/:id', protect as RequestHandler, authorize('administrador') as RequestHandler, excluirAdotante as RequestHandler);

export default router; 
