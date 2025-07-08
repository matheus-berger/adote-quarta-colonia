import { Request, Response } from 'express';
import User, { IUser, UserRole } from '../models/User';
import Abrigo, { IAbrigo } from '../models/Abrigo';
import Adotante, { IAdotante } from '../models/Adotante';
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
    // Desestrutura os campos do corpo da requisição
    // Incluímos nome, endereco, telefone que serão usados para criar Abrigo/Adotante
    const { email, password, role, nome, endereco, telefone } = req.body;

    // Validação básica de campos essenciais
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Por favor, forneça e-mail, senha e tipo de usuário.' });
    }

    let createdEntityId: mongoose.Types.ObjectId | undefined;

    // Lógica para criar a entidade (Abrigo ou Adotante) com base no 'role'
    if (role === 'abrigo') {
      // Para abrigos, nome, endereço e telefone são obrigatórios
      if (!nome || !endereco || !telefone) {
        return res.status(400).json({ message: 'Para o tipo "abrigo", nome, endereço e telefone são obrigatórios.' });
      }
      // Cria um novo Abrigo com os dados fornecidos
      const novoAbrigo: HydratedDocument<IAbrigo> = new Abrigo({ nome, endereco, telefone, email });
      await novoAbrigo.save(); // Salva o abrigo no banco de dados
      createdEntityId = novoAbrigo._id; // Obtém o ID do abrigo recém-criado
    } else if (role === 'adotante') {
      // Para adotantes, nome, endereço e telefone também são obrigatórios
      if (!nome || !endereco || !telefone) {
        return res.status(400).json({ message: 'Para o tipo "adotante", nome, endereço e telefone são obrigatórios.' });
      }
      // Cria um novo Adotante com os dados fornecidos
      const novoAdotante: HydratedDocument<IAdotante> = new Adotante({ nome, endereco, telefone, email });
      await novoAdotante.save(); // Salva o adotante no banco de dados
      createdEntityId = novoAdotante._id; // Obtém o ID do adotante recém-criado
    } else if (role === 'administrador') {
      // Administradores não são vinculados a uma entidade Abrigo/Adotante
      createdEntityId = undefined;
    } else {
      // Caso o 'role' seja inválido
      return res.status(400).json({ message: 'Tipo de usuário (role) inválido.' });
    }

    // Cria o novo usuário no sistema
    const user: HydratedDocument<IUser> = new User({
      email,
      password,
      role,
      entityId: createdEntityId // Vincula o ID da entidade recém-criada ao usuário
    });
    await user.save(); // Salva o usuário no banco de dados (a senha será hashada automaticamente)

    // Envia a resposta com o token JWT e os dados do usuário
    sendTokenResponse(user, 201, res);
  } catch (error: any) {
      // Tratamento de erros de validação e duplicidade
      if (error.name === 'ValidationError') {
          const messages = Object.values(error.errors).map((val: any) => val.message);
          return res.status(400).json({ message: messages.join(', ') });
      }
      if (error.code === 11000) { // Erro de chave duplicada (e.g., email, nome)
          let errorMessage = 'E-mail já cadastrado.';
          // Verifica se a duplicidade é no nome do abrigo/adotante
          if (error.keyPattern && error.keyPattern.nome) {
              errorMessage = 'Nome do abrigo/adotante já cadastrado.';
          }
          // Verifica se a duplicidade é no e-mail do abrigo/adotante (se for diferente do e-mail do usuário)
          else if (error.keyPattern && error.keyPattern.email) {
              errorMessage = 'E-mail já cadastrado para outra entidade ou usuário.';
          }
          return res.status(400).json({ message: errorMessage });
      }
      console.error('Erro ao registrar usuário:', error);
      res.status(500).json({ message: 'Erro interno do servidor ao registrar usuário.', error: error.message });
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
