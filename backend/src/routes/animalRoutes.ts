import { RequestHandler, Router } from 'express';
import {
  criarAnimal,
  listarAnimais,
  buscarAnimalPorId,
  atualizarAnimal,
  excluirAnimal
} from '../controllers/AnimalController';

const router = Router();

router.post('/', criarAnimal as RequestHandler); // (POST /api/animais)
router.get('/', listarAnimais as RequestHandler); // (GET /api/animais)
router.get('/:id', buscarAnimalPorId as RequestHandler); // (GET /api/animais/:id)
router.put('/:id', atualizarAnimal as RequestHandler); // (PUT /api/animais/:id)
router.delete('/:id', excluirAnimal as RequestHandler); // (DELETE /api/animais/:id)

export default router; // Exporta o router para ser usado no server.ts
