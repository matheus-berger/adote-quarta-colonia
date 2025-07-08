// Interface para o Abrigo (simplificada para o frontend)
export interface IAbrigoFrontend {
  _id: string;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  createdAt: string; // Datas geralmente vêm como string ISO do backend
  updatedAt: string;
}

// Interface para o Animal (simplificada para o frontend)
export interface IAnimalFrontend {
  _id: string;
  nome: string;
  especie: 'cachorro' | 'gato';
  raca?: string;
  idade: number;
  sexo: 'Macho' | 'Fêmea';
  descricao: string;
  fotos: string[];
  // Quando populado, abrigoResponsavel virá como um objeto IAbrigoFrontend
  abrigoResponsavel: string | IAbrigoFrontend; // Pode ser o ID (string) ou o objeto populado
  createdAt: string;
  updatedAt: string;
}

// Interface para o Adotante (simplificada para o frontend)
export interface IAdotanteFrontend {
  _id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  createdAt: string;
  updatedAt: string;
}

// Interface para a Adoção (simplificada para o frontend)
export interface IAdocaoFrontend {
  _id: string;
  adotante: string | IAdotanteFrontend; // Pode ser o ID (string) ou o objeto populado
  animal: string | IAnimalFrontend;     // Pode ser o ID (string) ou o objeto populado
  dataAdocao: string;
  createdAt: string;
  updatedAt: string;
}

// Interface para o Usuário (simplificada para o frontend)
export interface IUserFrontend {
  id: string;
  email: string;
  role: 'administrador' | 'abrigo' | 'adotante';
  entityId?: string; // ID da entidade vinculada (Abrigo ou Adotante)
}