// src/config/database.js
const { Pool } = require('pg');
require('dotenv').config();

// Configuração do pool de conexões
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Máximo de conexões simultâneas
  idleTimeoutMillis: 30000, // Timeout para conexões inativas
  connectionTimeoutMillis: 2000, // Timeout para estabelecer conexão
});

// Função para testar conexão
async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    
    console.log('✅ Conexão com PostgreSQL estabelecida!');
    console.log('🕐 Timestamp do banco:', result.rows[0].now);
    return true;
  } catch (err) {
    console.error('❌ Erro na conexão com PostgreSQL:', err.message);
    return false;
  }
}

// Função para executar queries
async function query(text, params) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Query executada:', { text, duration, rows: result.rowCount });
    }
    
    return result;
  } catch (err) {
    console.error('❌ Erro na query:', err.message);
    throw err;
  }
}

// Função para transações
async function transaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  query,
  transaction,
  testDatabaseConnection
};
