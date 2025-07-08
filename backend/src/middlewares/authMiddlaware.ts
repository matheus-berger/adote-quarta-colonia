import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import User, { IUser, UserRole } from '../models/User';
import { HydratedDocument } from 'mongoose';

// Extende a interface Request do Express para incluir a propriedade 'user'
// Isso permite que o TypeScript reconheça req.user nas rotas protegidas
declare global {
  namespace Express {
    interface Request {
      user?: HydratedDocument<IUser>; // O usuário autenticado
      userRole?: UserRole; // O papel do usuário
    }
  }
}

// @desc    Protege rotas verificando o JWT
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Verifica se o token está presente no cabeçalho Authorization (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Extrai o token da string "Bearer TOKEN"
  }

  // Se nenhum token for encontrado
  if (!token) {
    return res.status(401).json({ message: 'Não autorizado, nenhum token.' });
  }

  try {
    const jwtSecret: Secret = process.env.JWT_SECRET as Secret; // Garante que JWT_SECRET é um tipo Secret

    // Verifica e decodifica o token
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    // Busca o usuário pelo ID do token decodificado
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Não autorizado, usuário não encontrado.' });
    }

    // Anexa o usuário ao objeto de requisição para que as rotas subsequentes possam acessá-lo
    req.user = user as HydratedDocument<IUser>;
    req.userRole = user.role; // Anexa o papel do usuário também

    next(); // Chama a próxima função middleware ou a rota
  } catch (error: any) {
    console.error('Erro na autenticação do token:', error.message);
    res.status(401).json({ message: 'Não autorizado, token falhou.' });
  }
};

// @desc    Middleware de autorização baseado em papel (role)
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Verifica se o usuário autenticado possui um dos papéis permitidos
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({ message: `Usuário com papel '${req.userRole}' não autorizado a acessar esta rota.` }); // 403 Forbidden
    }
    next(); // Chama a próxima função middleware ou a rota
  };
};
