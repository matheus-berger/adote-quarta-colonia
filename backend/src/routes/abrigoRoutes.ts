import { RequestHandler, Router } from 'express';
import { 
  atualizarAbrigo, 
  buscarAbrigoPorId, 
  criarAbrigo, 
  excluirAbrigo, 
  listarAbrigos 
} from '../controllers/AbrigoController';

const router = Router(); // Cria uma nova instância de Router do Express

router.post('/', criarAbrigo as RequestHandler); // (POST /api/abrigos)
router.get('/', listarAbrigos as RequestHandler); // (GET /api/abrigos)
router.get('/:id', buscarAbrigoPorId as RequestHandler); // (GET /api/abrigos/:id)
router.put('/:id', atualizarAbrigo as RequestHandler); // (PUT /api/abrigos/:id)
router.delete('/:id', excluirAbrigo as RequestHandler); // (DELETE /api/abrigos/:id)

export default router;
