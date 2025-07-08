import { Router, RequestHandler } from 'express'; 
import {
  criarAdocao,
  listarAdocoes,
  buscarAdocaoPorId,
  atualizarAdocao,
  excluirAdocao
} from '../controllers/AdocaoController'; 

const router = Router(); 

router.post('/', criarAdocao as RequestHandler); 
router.get('/', listarAdocoes as RequestHandler); 
router.get('/:id', buscarAdocaoPorId as RequestHandler); 
router.put('/:id', atualizarAdocao as RequestHandler); 
router.delete('/:id', excluirAdocao as RequestHandler); 

export default router;
