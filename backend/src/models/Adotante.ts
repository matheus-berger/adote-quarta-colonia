import { model, Schema } from "mongoose";

// Tipagem TypeScript para o objeto adotante.
export interface IAdotante extends Document {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  dataCadastro: Date;
  dataAtualizacao: Date;
}

// Schema Mongoose para Adotante.
const AdotanteSchema = new Schema<IAdotante>({
  nome: {
    type: String,
    required: [true, 'O nome do adotante é obrigatório.'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'O e-mail do adotante é obrigatório.'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Formato de e-mail inválido.']
  },
  telefone: {
    type: String,
    required: [true, 'O telefone do adotante é obrigatório.'],
    trim: true,
    match: [/^\(\d{2}\)\s?\d{4,5}-\d{4}$/, 'Formato de telefone inválido. Use (XX) XXXX-XXXX ou (XX) XXXXX-XXXX.']
  },
  endereco: {
    type: String,
    required: [true, 'O endereço do adotante é obrigatório.'],
    trim: true
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
  timestamps: true
});

// Middleware Mongoose (hook) para atualizar 'dataAtualizacao' antes de salvar
AdotanteSchema.pre('save', function(next) {
  this.dataAtualizacao = new Date(Date.now());
  next();
});

// Modelo Mongoose.
export default model<IAdotante>('Adotante', AdotanteSchema);
