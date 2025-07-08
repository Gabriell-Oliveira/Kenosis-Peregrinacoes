// src/config/supabase.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Validar variáveis de ambiente
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('❌ Variáveis de ambiente do Supabase não configuradas!');
}

// Criar cliente do Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Função para testar conexão
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('pessoas')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Erro na conexão com Supabase:', error.message);
      return false;
    }
    
    console.log('✅ Conexão com Supabase estabelecida!');
    return true;

  } catch (err) {
    console.error('❌ Erro ao conectar com Supabase:', err.message);
    return false;
  }
}

module.exports = {
  supabase,
  testConnection
};
