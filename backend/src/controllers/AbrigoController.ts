import { Request, Response } from 'express';
import Abrigo, { IAbrigo } from '../models/Abrigo';
import mongoose, { HydratedDocument } from 'mongoose';

export const criarAbrigo = async (req: Request, res: Response) => {
  try {
    const novoAbrigo: HydratedDocument<IAbrigo> = new Abrigo(req.body);
    await novoAbrigo.save();
    res.status(201).json(novoAbrigo);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.code === 11000) { // Erro de chave duplicada (e.g., nome ou email já existem)
      return res.status(400).json({ message: 'Nome ou e-mail do abrigo já cadastrado.' });
    }
    res.status(500).json({ message: 'Erro ao criar abrigo', error: error.message });
  }
};

export const listarAbrigos = async (req: Request, res: Response) => {
  try {
    const abrigos = await Abrigo.find();
    res.status(200).json(abrigos);
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao listar abrigos', error: error.message });
  }
};

export const buscarAbrigoPorId = async (req: Request, res: Response) => {
  try {
    // Verifica se o ID fornecido é um ObjectId válido do Mongoose
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de abrigo inválido.' });
    }
    const abrigo = await Abrigo.findById(req.params.id); // Busca um abrigo pelo ID
    if (!abrigo) {
      return res.status(404).json({ message: 'Abrigo não encontrado.' }); // Retorna 404 se não encontrar
    }
    res.status(200).json(abrigo); // Retorna o abrigo encontrado
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao buscar abrigo', error: error.message });
  }
};


export const atualizarAbrigo = async (req: Request, res: Response) => {
  try {
    // Verifica se o ID fornecido é um ObjectId válido do Mongoose
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de abrigo inválido.' });
    }
    const abrigoAtualizado = await Abrigo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Retorna o documento atualizado e executa as validações do schema
    );
    if (!abrigoAtualizado) {
      return res.status(404).json({ message: 'Abrigo não encontrado para atualização.' });
    }
    res.status(200).json(abrigoAtualizado); // Retorna o abrigo atualizado
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Nome ou e-mail do abrigo já cadastrado.' });
    }
    res.status(500).json({ message: 'Erro ao atualizar abrigo', error: error.message });
  }
};


export const excluirAbrigo = async (req: Request, res: Response) => {
    try {
      // Verifica se o ID fornecido é um ObjectId válido do Mongoose
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'ID de abrigo inválido.' });
      }
      const abrigoExcluido = await Abrigo.findByIdAndDelete(req.params.id); // Exclui um abrigo pelo ID
      if (!abrigoExcluido) {
        return res.status(404).json({ message: 'Abrigo não encontrado para exclusão.' });
      }
      res.status(200).json({ message: 'Abrigo excluído com sucesso.' }); // Retorna mensagem de sucesso
    } catch (error: any) {
      res.status(500).json({ message: 'Erro ao excluir abrigo', error: error.message });
    }
};
