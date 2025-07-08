// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Importar configurações de banco
const { testConnection } = require('./config/supabase');
const { testDatabaseConnection } = require('./config/database');

// Inicializar Express
const app = express();

// ============================================
// TESTE DE CONEXÕES (ADICIONAR DEPOIS DOS IMPORTS)
// ============================================

// Testar conexões na inicialização
async function initializeConnections() {
  console.log('🔄 Testando conexões com banco de dados...');
  
  const supabaseOk = await testConnection();
  const postgresOk = await testDatabaseConnection();
  
  if (supabaseOk && postgresOk) {
    console.log('✅ Todas as conexões estabelecidas com sucesso!');
  } else {
    console.log('⚠️  Algumas conexões falharam, mas o servidor continuará rodando...');
  }
}

// Executar testes de conexão
initializeConnections();

// ============================================
// MIDDLEWARES DE SEGURANÇA
// ============================================

// Helmet para segurança
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://seudominio.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requisições por IP
  message: {
    error: 'Muitas requisições deste IP, tente novamente em alguns minutos.'
  }
});
app.use(limiter);

// ============================================
// MIDDLEWARES DE PARSING
// ============================================

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ============================================
// ROTAS
// ============================================

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Servidor está funcionando!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Rota de teste
app.get('/api/test', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API está funcionando!',
    data: {
      server: 'Kenosis Backend',
      version: '1.0.0'
    }
  });
});

// Nova rota para testar conexão com banco
app.get('/api/test-db', async (req, res) => {
  try {
    const { supabase } = require('./config/supabase');
    
    const { data, error } = await supabase
      .from('pessoas')
      .select('nome')
      .limit(1);
    
    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Erro na conexão com o banco',
        error: error.message
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Conexão com banco funcionando!',
      data: {
        connected: true,
        sampleData: data
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao testar conexão',
      error: err.message
    });
  }
});

// ============================================
// TRATAMENTO DE ERROS
// ============================================

// Rota não encontrada
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Rota ${req.originalUrl} não encontrada!`
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('💥 Erro:', err);
  
  res.status(err.status || 500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Algo deu errado!'
  });
});

module.exports = app;
