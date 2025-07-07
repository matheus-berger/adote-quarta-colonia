import { model, Schema, Types } from "mongoose";

// Tipagem TypeScript para o objeto animal.
export interface IAnimal extends Document {
  nome: string;
  especie: 'cachorro' | 'gato';
  raca?: string;
  idade: number;
  sexo: 'Macho' | 'Fêmea';
  descricao: string;
  fotos: string[]; // Array de URLs de fotos
  abrigoResponsavel: Types.ObjectId; // Referência ao ID do Abrigo
  dataCadastro: Date;
  dataAtualizacao: Date;
}

// Definindo Schema Mongoose para Animal.
const AnimalSchema = new Schema<IAnimal>({
  nome: {
    type: String,
    required: [true, 'O nome do animal é obrigatório.'],
    trim: true
  },
  especie: {
    type: String,
    enum: ['cachorro', 'gato'], // Garante que a espécie seja 'cachorro' ou 'gato'
    required: [true, 'A espécie do animal é obrigatória.']
  },
  raca: {
    type: String,
    trim: true
  },
  idade: {
    type: Number,
    required: [true, 'A idade do animal é obrigatória.'],
    min: [0, 'A idade não pode ser negativa.']
  },
  sexo: {
    type: String,
    enum: ['Macho', 'Fêmea'],
    required: [true, 'O sexo do animal é obrigatório.']
  },
  descricao: {
    type: String,
    required: [true, 'A descrição do animal é obrigatória.'],
    trim: true,
    minlength: [10, 'A descrição deve ter no mínimo 10 caracteres.']
  },
  fotos: [{
    type: String,
    required: [true, 'Pelo menos uma foto é obrigatória.'],
    // Regex simples para validar se é uma URL
    match: [/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/, 'Formato de URL de foto inválido.']
  }],
  abrigoResponsavel: {
    type: Schema.Types.ObjectId, // Define que este campo é uma referência a um ObjectId
    ref: 'Abrigo', // Indica que ele se refere ao modelo 'Abrigo'
    required: [true, 'O abrigo responsável é obrigatório.']
  },
  dataCadastro: {
    type: Date,
    default: Date.now
  },
  dataAtualizacao: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adiciona automaticamente createdAt e updatedAt
});

// Middleware Mongoose (hook) para atualizar 'dataAtualizacao' antes de salvar
AnimalSchema.pre('save', function (next) {
  this.dataAtualizacao = new Date(Date.now());
  next();
});

// Exportando o Modelo Mongoose.
export default model<IAnimal>('Animal', AnimalSchema);
