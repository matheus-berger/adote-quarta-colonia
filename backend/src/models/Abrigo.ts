import { model, Schema } from "mongoose";

// Tipagem TypeScript para o objeto abrigo.
export interface IAbrigo extends Document {
    nome: string;
    endereco: string;
    telefone: string;
    email: string;
    dataCadastro: Date;
    dataAtualizacao: Date;
}

// Schema Mongoose para Abrigo. Estrutura de documentos na coleção 'abrigos'
const AbrigoSchema = new Schema<IAbrigo>({
    nome: {
        type: String,
        required: [true, 'O nome do abrigo é obrigatório.'],
        unique: true,
        trim: true
    },
    endereco: {
        type: String,
        required: [true, 'O endereço é obrigatório.'],
        trim: true
    },
    telefone: {
        type: String,
        required: [true, 'O telefone é obrigatório.'],
        trim: true,
        // Regex simples para validar formato de telefone (ex: (XX) XXXX-XXXX ou XXXXX-XXXX)
        match: [/^\(\d{2}\)\s?\d{4,5}-\d{4}$/, 'Formato de telefone inválido. Use (XX) XXXX-XXXX ou (XX) XXXXX-XXXX.']
    },
    email: {
        type: String,
        required: [true, 'O e-mail é obrigatório.'],
        unique: true,
        trim: true,
        lowercase: true, // Converte o e-mail para minúsculas antes de salvar
        // Regex para validar formato de e-mail
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Formato de e-mail inválido.']
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
    timestamps: true // Adiciona automaticamente campos `createdAt` e `updatedAt`
});

// Middleware Mongoose (hook) para atualizar 'dataAtualizacao' antes de salvar
AbrigoSchema.pre('save', function (next) {
    this.dataAtualizacao = new Date(Date.now());
    next();
});

// Exportando o Modelo Mongoose.
export default model<IAbrigo>('Abrigo', AbrigoSchema);
