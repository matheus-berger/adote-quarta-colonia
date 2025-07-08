import { Router, RequestHandler } from 'express'; // Importa RequestHandler para tipagem
import {
  criarAdotante,
  listarAdotantes,
  buscarAdotantePorId,
  atualizarAdotante,
  excluirAdotante
} from '../controllers/AdotanteController'; 

const router = Router(); 

router.post('/', criarAdotante as RequestHandler);
router.get('/', listarAdotantes as RequestHandler); 
router.get('/:id', buscarAdotantePorId as RequestHandler);
router.put('/:id', atualizarAdotante as RequestHandler); 
router.delete('/:id', excluirAdotante as RequestHandler); 

export default router; 
