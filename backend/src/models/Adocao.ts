import { model, Schema, Types } from "mongoose";

// Tipagem TypeScript para o objeto Adocao.
export interface IAdocao extends Document {
  adotante: Types.ObjectId; // Referência ao ID do Adotante
  animal: Types.ObjectId;   // Referência ao ID do Animal
  dataAdocao: Date;
  dataAtualizacao: Date;
}

// Schema Mongoose para Adocao.
const AdocaoSchema = new Schema<IAdocao>({
  adotante: {
    type: Schema.Types.ObjectId,
    ref: 'Adotante', // Refere-se ao modelo 'Adotante'
    required: [true, 'O adotante é obrigatório.']
  },
  animal: {
    type: Schema.Types.ObjectId,
    ref: 'Animal', // Refere-se ao modelo 'Animal'
    required: [true, 'O animal é obrigatório.']
  },
  dataAdocao: {
    type: Date,
    default: Date.now,
    required: [true, 'A data da adoção é obrigatória.']
  },
  dataAtualizacao: {
    type: Date,
    default: Date.now
  }
}, {
    timestamps: true
});

// Middleware Mongoose (hook) para atualizar 'dataAtualizacao' antes de salvar
AdocaoSchema.pre('save', function(next) {
    this.dataAtualizacao = new Date(Date.now());
    next();
});

// Modelo Mongoose.
export default model<IAdocao>('Adocao', AdocaoSchema);
