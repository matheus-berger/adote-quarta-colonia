import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { StringValue } from 'ms';

// Tipos de usuário permitidos
export type UserRole = 'administrador' | 'abrigo' | 'adotante';

// Interface para o documento User.
export interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole; // 'administrador', 'abrigo', 'adotante'
  entityId?: Schema.Types.ObjectId; // ID do Abrigo ou Adotante ao qual este usuário está vinculado (Se for ADM fica vazio)
  dataCadastro: Date;
  dataAtualizacao: Date;
  // Métodos para o modelo (Mongoose instance methods)
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

// Schema Mongoose para User.
const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'O e-mail é obrigatório.'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Formato de e-mail inválido.']
  },
  password: {
    type: String,
    required: [true, 'A senha é obrigatória.'],
    minlength: [6, 'A senha deve ter no mínimo 6 caracteres.']
  },
  role: {
    type: String,
    enum: ['administrador', 'abrigo', 'adotante'],
    required: [true, 'O tipo de usuário (role) é obrigatório.'],
    default: 'adotante' // Adotante como padrão se não for especificado
  },
  entityId: {
    type: Schema.Types.ObjectId,
    // Não usamos 'ref' aqui diretamente porque pode referenciar Abrigo ou Adotante.
    // A validação de qual entidade é será feita no controlador.
    required: false // Opcional, pois nem todo usuário terá um entityId (ex: administrador puro)
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

// Middleware Mongoose (hook) para hash da senha antes de salvar
UserSchema.pre('save', async function (next) {
  // Só faz o hash se a senha foi modificada ou é nova
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10); // Gera um salt (valor aleatório)
  this.password = await bcrypt.hash(this.password, salt); // Faz o hash da senha
  this.dataAtualizacao = new Date(Date.now()); // Atualiza data de atualização
  next();
});

// Método de instância para comparar senhas
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método de instância para gerar JWT
UserSchema.methods.generateAuthToken = function (): string {
  const secret: Secret = process.env.JWT_SECRET as Secret;
  const expiresIn = process.env.JWT_EXPIRES_IN;

  if (!secret) {
    throw new Error('JWT_SECRET não está definido nas variáveis de ambiente.');
  }

  const payload = {
    id: this._id,
    role: this.role,
    entityId: this.entityId
  };

  const options: SignOptions = {
    expiresIn: (expiresIn || '1h') as StringValue
  };

  return jwt.sign(payload, secret, options);
};

// Exportando o Modelo Mongoose.
export default model<IUser>('User', UserSchema);
