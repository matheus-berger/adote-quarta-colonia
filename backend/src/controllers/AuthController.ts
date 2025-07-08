import { Request, Response } from 'express';
import User, { IUser, UserRole } from '../models/User';
import Abrigo from '../models/Abrigo';
import Adotante from '../models/Adotante';
import mongoose, { HydratedDocument } from 'mongoose';

// Função auxiliar para gerar e enviar o token JWT
const sendTokenResponse = (user: HydratedDocument<IUser>, statusCode: number, res: Response) => {
  const token = user.generateAuthToken(); // Gera o JWT usando o método do modelo User

  // Opções para o cookie (se você for usar cookies para armazenar o token)
  const options = {
    expires: new Date(Date.now() + parseInt(process.env.JWT_EXPIRES_IN_NUMERIC || '86400000') * 24 * 60 * 60 * 1000), // Exemplo: 1 dia em milissegundos
    httpOnly: true, // O cookie não pode ser acessado via JavaScript no navegador (segurança)
    secure: process.env.NODE_ENV === 'production' // Apenas HTTPS em produção
  };

  // Envia o token no corpo da resposta (e opcionalmente em um cookie)
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      entityId: user.entityId // Inclui o entityId na resposta
    }
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role, entityId } = req.body;

    // Validação básica de campos
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Por favor, forneça e-mail, senha e tipo de usuário.' });
    }

    // Verificar e validar entityId com base no role
    if (role === 'abrigo') {
      if (!entityId || !mongoose.Types.ObjectId.isValid(entityId)) {
        return res.status(400).json({ message: 'ID do abrigo é obrigatório e deve ser válido para o tipo "abrigo".' });
      }
      const abrigo = await Abrigo.findById(entityId);
      if (!abrigo) {
        return res.status(404).json({ message: 'Abrigo não encontrado para vincular.' });
      }
    } else if (role === 'adotante') {
      if (!entityId || !mongoose.Types.ObjectId.isValid(entityId)) {
        return res.status(400).json({ message: 'ID do adotante é obrigatório e deve ser válido para o tipo "adotante".' });
      }
      const adotante = await Adotante.findById(entityId);
      if (!adotante) {
        return res.status(404).json({ message: 'Adotante não encontrado para vincular.' });
      }
    } else if (role === 'administrador') {
      // Administradores podem não ter um entityId, ou ter um específico para admin
      // Por enquanto, não exigimos entityId para admin
      if (entityId && !mongoose.Types.ObjectId.isValid(entityId)) {
        return res.status(400).json({ message: 'ID de entidade de administrador inválido, se fornecido.' });
      }
    } else {
      return res.status(400).json({ message: 'Tipo de usuário (role) inválido.' });
    }

    // Cria o novo usuário
    const user: HydratedDocument<IUser> = new User({ email, password, role, entityId });
    await user.save();

    sendTokenResponse(user, 201, res); // Envia o token e os dados do usuário
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'E-mail já cadastrado.' });
    }
    res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor, forneça e-mail e senha.' });
    }

    // 1. Verifica se o usuário existe
    const user = await User.findOne({ email }).select('+password'); // Seleciona a senha que está oculta por padrão
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' }); // 401 Unauthorized
    }

    // 2. Compara a senha fornecida com a senha hash no banco de dados
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    sendTokenResponse(user, 200, res); // Envia o token e os dados do usuário
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  // O usuário é anexado ao objeto req pelo middleware de proteção de rota (próximo passo)
  // @ts-ignore
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user
  });
};
