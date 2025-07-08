import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import abrigoRoutes from './routes/abrigoRoutes';
import animalRoutes from './routes/animalRoutes';
import adotanteRoutes from './routes/adotanteRoutes';
import adocaoRoutes from './routes/adocaoRoutes';
import authRoutes from './routes/authRoutes';
import cors from 'cors'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Erro: A variável de ambiente MONGO_URI não está definida no arquivo .env');
  process.exit(1);
}

// Conexão com o MongoDB Atlas
mongoose.connect(MONGO_URI)
  .then(() => {
    // Confirmando conexão com o MongoDB
    console.log('Conectado ao MongoDB Atlas com sucesso!');
    // Iniciando o servidor Express
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Acesse: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB Atlas:', error.message);
    process.exit(1);
  });

// --- Configuração do CORS ---
// Em desenvolvimento, permitir de qualquer origem é prático.
// Em produção, você deve especificar as origens permitidas!
app.use(cors({
  origin: 'http://localhost:5173', // Permite requisições APENAS do seu frontend local
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  credentials: true // Permite o envio de cookies e cabeçalhos de autorização
}));
// --- Fim da Configuração do CORS ---

// Middleware para JSON no corpo das requisições
app.use(express.json());

// Rotas da API
app.use('/api/abrigos', abrigoRoutes); // Monta as rotas de abrigo em /api/abrigos
app.use('/api/animais', animalRoutes); // Monta as rotas de animal em /api/animais
app.use('/api/adotantes', adotanteRoutes); // Monta as rotas de adotante em /api/adotantes
app.use('/api/adocoes', adocaoRoutes); // Monta as rotas de adoção em /api/adocoes
app.use('/api/auth', authRoutes); // Monta as rotas de autenticação em /api/auth

// Rota de teste simples
app.get('/', (req, res) => {
  res.send('API Adote Quarta Colônia em execução!');
});

// Mais rotas e lógica aqui. comming soon...
