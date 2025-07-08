import { Request, Response } from 'express';
import Adocao, { IAdocao } from '../models/Adocao'; 
import Adotante from '../models/Adotante';
import Animal from '../models/Animal';
import mongoose, { HydratedDocument } from 'mongoose';

export const criarAdocao = async (req: Request, res: Response) => {
  try {
    const { adotante, animal, ...adocaoData } = req.body;

    // Validar se adotante e animal são ObjectIds válidos
    if (!mongoose.Types.ObjectId.isValid(adotante) || !mongoose.Types.ObjectId.isValid(animal)) {
      return res.status(400).json({ message: 'IDs de adotante ou animal inválidos.' });
    }

    // Verificar se o adotante realmente existe
    const adotanteExistente = await Adotante.findById(adotante);
    if (!adotanteExistente) {
      return res.status(404).json({ message: 'Adotante não encontrado.' });
    }

    // Verificar se o animal realmente existe
    const animalExistente = await Animal.findById(animal);
    if (!animalExistente) {
      return res.status(404).json({ message: 'Animal não encontrado.' });
    }

    // Criar a nova adoção
    const novaAdocao: HydratedDocument<IAdocao> = new Adocao({ ...adocaoData, adotante, animal });
    await novaAdocao.save();
    res.status(201).json(novaAdocao);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Erro ao criar adoção', error: error.message });
  }
};

export const listarAdocoes = async (req: Request, res: Response) => {
  try {
    const { adotante, animal } = req.query;
    const filter: any = {};

    if (adotante) {
      if (!mongoose.Types.ObjectId.isValid(adotante as string)) {
        return res.status(400).json({ message: 'ID de adotante inválido no filtro.' });
      }
      filter.adotante = adotante;
    }
    if (animal) {
      if (!mongoose.Types.ObjectId.isValid(animal as string)) {
        return res.status(400).json({ message: 'ID de animal inválido no filtro.' });
      }
      filter.animal = animal;
    }

    // Popula os campos 'adotante' e 'animal' para trazer os detalhes completos
    const adocoes = await Adocao.find(filter)
      .populate('adotante', 'nome email telefone')
      .populate('animal', 'nome especie raca');
    res.status(200).json(adocoes);
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao listar adoções', error: error.message });
  }
};

export const buscarAdocaoPorId = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de adoção inválido.' });
    }
    const adocao = await Adocao.findById(req.params.id)
      .populate('adotante', 'nome email telefone endereco')
      .populate('animal', 'nome especie raca descricao');
    if (!adocao) {
      return res.status(404).json({ message: 'Adoção não encontrada.' });
    }
    res.status(200).json(adocao);
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao buscar adoção', error: error.message });
  }
};

export const atualizarAdocao = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de adoção inválido.' });
    }

    const { adotante, animal, ...updateData } = req.body;

    if (adotante) {
      if (!mongoose.Types.ObjectId.isValid(adotante)) {
        return res.status(400).json({ message: 'ID de adotante inválido na atualização.' });
      }
      const adotanteExistente = await Adotante.findById(adotante);
      if (!adotanteExistente) {
        return res.status(404).json({ message: 'Adotante não encontrado na atualização.' });
      }
    }
    if (animal) {
      if (!mongoose.Types.ObjectId.isValid(animal)) {
        return res.status(400).json({ message: 'ID de animal inválido na atualização.' });
      }
      const animalExistente = await Animal.findById(animal);
      if (!animalExistente) {
        return res.status(404).json({ message: 'Animal não encontrado na atualização.' });
      }
    }

    const adocaoAtualizada = await Adocao.findByIdAndUpdate(
      req.params.id,
      { ...updateData, ...(adotante && { adotante }), ...(animal && { animal }) },
      { new: true, runValidators: true }
    ).populate('adotante', 'nome').populate('animal', 'nome');

    if (!adocaoAtualizada) {
      return res.status(404).json({ message: 'Adoção não encontrada para atualização.' });
    }
    res.status(200).json(adocaoAtualizada);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Erro ao atualizar adoção', error: error.message });
  }
};

export const excluirAdocao = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de adoção inválido.' });
    }
    const adocaoExcluida = await Adocao.findByIdAndDelete(req.params.id);
    if (!adocaoExcluida) {
      return res.status(404).json({ message: 'Adoção não encontrada para exclusão.' });
    }
    res.status(200).json({ message: 'Adoção excluída com sucesso.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao excluir adoção', error: error.message });
  }
};