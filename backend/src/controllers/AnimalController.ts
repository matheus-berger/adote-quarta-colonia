import { Request, Response } from 'express';
import Animal, { IAnimal } from '../models/Animal';
import Abrigo from '../models/Abrigo';
import mongoose, { HydratedDocument } from 'mongoose';

export const criarAnimal = async (req: Request, res: Response) => {
  try {
    const { abrigoResponsavel, ...animalData } = req.body;

    // Validar se o abrigoResponsavel é um ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(abrigoResponsavel)) {
      return res.status(400).json({ message: 'ID de abrigo responsável inválido.' });
    }

    // Verificar se o abrigoResponsavel realmente existe no banco de dados
    const abrigoExistente = await Abrigo.findById(abrigoResponsavel);
    if (!abrigoExistente) {
      return res.status(404).json({ message: 'Abrigo responsável não encontrado.' });
    }

    // Criar o novo animal
    const novoAnimal: HydratedDocument<IAnimal> = new Animal({ ...animalData, abrigoResponsavel });
    await novoAnimal.save();
    res.status(201).json(novoAnimal);

  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Erro ao criar animal', error: error.message });
  }
};

export const listarAnimais = async (req: Request, res: Response) => {
  try {
    const { especie, raca, idade, abrigo } = req.query;
    const filter: any = {};

    if (especie) filter.especie = especie;
    if (raca) filter.raca = raca;
    if (idade) filter.idade = parseInt(idade as string); // Converte idade para número
    if (abrigo) {
      // Valida se o ID do abrigo é válido antes de adicionar ao filtro
      if (!mongoose.Types.ObjectId.isValid(abrigo as string)) {
        return res.status(400).json({ message: 'ID de abrigo inválido no filtro.' });
      }
      filter.abrigoResponsavel = abrigo;
    }

    const animais = await Animal.find(filter).populate('abrigoResponsavel', 'nome email telefone'); // Popula apenas nome, email e telefone do abrigo
    res.status(200).json(animais);
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao listar animais', error: error.message });
  }
};

export const buscarAnimalPorId = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de animal inválido.' });
    }
    // Popula o campo 'abrigoResponsavel' para exibir os detalhes do abrigo junto com o animal
    const animal = await Animal.findById(req.params.id).populate('abrigoResponsavel', 'nome email telefone endereco');
    if (!animal) {
      return res.status(404).json({ message: 'Animal não encontrado.' });
    }
    res.status(200).json(animal);
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao buscar animal', error: error.message });
  }
};

export const atualizarAnimal = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de animal inválido.' });
    }

    const { abrigoResponsavel, ...updateData } = req.body;

    // Se o abrigoResponsavel for passado na atualização, valide-o
    if (abrigoResponsavel) {
      if (!mongoose.Types.ObjectId.isValid(abrigoResponsavel)) {
        return res.status(400).json({ message: 'ID de abrigo responsável inválido na atualização.' });
      }
      const abrigoExistente = await Abrigo.findById(abrigoResponsavel);
      if (!abrigoExistente) {
        return res.status(404).json({ message: 'Abrigo responsável não encontrado na atualização.' });
      }
    }

    const animalAtualizado = await Animal.findByIdAndUpdate(
      req.params.id,
      { ...updateData, ...(abrigoResponsavel && { abrigoResponsavel }) }, // Inclui abrigoResponsavel se existir
      { new: true, runValidators: true }
    ).populate('abrigoResponsavel', 'nome email'); // Popula o abrigo após a atualização

    if (!animalAtualizado) {
      return res.status(404).json({ message: 'Animal não encontrado para atualização.' });
    }
    res.status(200).json(animalAtualizado);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Erro ao atualizar animal', error: error.message });
  }
};

export const excluirAnimal = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de animal inválido.' });
    }
    const animalExcluido = await Animal.findByIdAndDelete(req.params.id);
    if (!animalExcluido) {
      return res.status(404).json({ message: 'Animal não encontrado para exclusão.' });
    }
    res.status(200).json({ message: 'Animal excluído com sucesso.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao excluir animal', error: error.message });
  }
};
