// src/utils/validators.js

// Validar CPF
function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }
  
  // Validar primeiro dígito
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  
  // Validar segundo dígito
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}

// Formatar CPF
function formatarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Validar email
function validarEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validar telefone
function validarTelefone(telefone) {
  const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  return telefoneRegex.test(telefone);
}

// Formatar telefone
function formatarTelefone(telefone) {
  telefone = telefone.replace(/[^\d]+/g, '');
  if (telefone.length === 10) {
    return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (telefone.length === 11) {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return telefone;
}

// Validar data
function validarData(data) {
  const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dataRegex.test(data)) return false;
  
  const dateObj = new Date(data);
  return dateObj instanceof Date && !isNaN(dateObj);
}

module.exports = {
  validarCPF,
  formatarCPF,
  validarEmail,
  validarTelefone,
  formatarTelefone,
  validarData
};
