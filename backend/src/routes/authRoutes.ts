import { Router, RequestHandler } from 'express';
import { register, login, getMe } from '../controllers/AuthController';
// import { protect } from '../middleware/authMiddleware'; // Será criado no próximo passo

const router = Router();

// Rotas de autenticação
router.post('/register', register as RequestHandler);
router.post('/login', login as RequestHandler);
// router.get('/me', protect as RequestHandler, getMe as RequestHandler); // Rota para obter usuário logado (requer proteção)

export default router;
