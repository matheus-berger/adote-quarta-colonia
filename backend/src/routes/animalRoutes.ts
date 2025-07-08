import { RequestHandler, Router } from 'express';
import {
  criarAnimal,
  listarAnimais,
  buscarAnimalPorId,
  atualizarAnimal,
  excluirAnimal
} from '../controllers/AnimalController';
import { authorize, protect } from '../middlewares/authMiddlaware';

const router = Router();

// Rotas públicas
router.get('/', listarAnimais as RequestHandler);
router.get('/:id', buscarAnimalPorId as RequestHandler);

// Rotas protegidas (requerem autenticação e autorização de 'abrigo' ou 'administrador')
router.post('/', protect as RequestHandler, authorize('abrigo', 'administrador') as RequestHandler, criarAnimal as RequestHandler);
router.put('/:id', protect as RequestHandler, authorize('abrigo', 'administrador') as RequestHandler, atualizarAnimal as RequestHandler);
router.delete('/:id', protect as RequestHandler, authorize('abrigo', 'administrador') as RequestHandler, excluirAnimal as RequestHandler);

export default router; // Exporta o router para ser usado no server.ts
