
import { Request, Response } from 'express';
import Adotante, { IAdotante } from '../models/Adotante'; 
import mongoose, { HydratedDocument } from 'mongoose'; 

export const criarAdotante = async (req: Request, res: Response) => {
  try {
    const novoAdotante: HydratedDocument<IAdotante> = new Adotante(req.body);
    await novoAdotante.save(); 
    res.status(201).json(novoAdotante); 
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'E-mail do adotante já cadastrado.' });
    }
    res.status(500).json({ message: 'Erro ao criar adotante', error: error.message });
  }
};

export const listarAdotantes = async (req: Request, res: Response) => {
  try {
    const adotantes = await Adotante.find(); 
    res.status(200).json(adotantes); 
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao listar adotantes', error: error.message });
  }
};

export const buscarAdotantePorId = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de adotante inválido.' });
    }
    const adotante = await Adotante.findById(req.params.id); // Busca um adotante pelo ID
    if (!adotante) {
      return res.status(404).json({ message: 'Adotante não encontrado.' }); // Retorna 404 se não encontrar
    }
    res.status(200).json(adotante); // Retorna o adotante encontrado
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao buscar adotante', error: error.message });
  }
};

export const atualizarAdotante = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de adotante inválido.' });
    }
    const adotanteAtualizado = await Adotante.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!adotanteAtualizado) {
      return res.status(404).json({ message: 'Adotante não encontrado para atualização.' });
    }
    res.status(200).json(adotanteAtualizado); 
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'E-mail do adotante já cadastrado.' });
    }
    res.status(500).json({ message: 'Erro ao atualizar adotante', error: error.message });
  }
};

export const excluirAdotante = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de adotante inválido.' });
    }
    const adotanteExcluido = await Adotante.findByIdAndDelete(req.params.id); 
    if (!adotanteExcluido) {
      return res.status(404).json({ message: 'Adotante não encontrado para exclusão.' });
    }
    res.status(200).json({ message: 'Adotante excluído com sucesso.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao excluir adotante', error: error.message });
  }
};