// src/utils/response.js

// Resposta de sucesso
function success(res, data, message = 'Operação realizada com sucesso!', statusCode = 200) {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
    timestamp: new Date().toISOString()
  });
}

// Resposta de erro
function error(res, message = 'Erro interno do servidor', statusCode = 500, errors = null) {
  return res.status(statusCode).json({
    status: 'error',
    message,
    ...(errors && { errors }),
    timestamp: new Date().toISOString()
  });
}

// Resposta de não encontrado
function notFound(res, message = 'Recurso não encontrado') {
  return error(res, message, 404);
}

// Resposta de não autorizado
function unauthorized(res, message = 'Acesso não autorizado') {
  return error(res, message, 401);
}

// Resposta de dados inválidos
function badRequest(res, message = 'Dados inválidos', validationErrors = null) {
  return error(res, message, 400, validationErrors);
}

// Resposta de conflito
function conflict(res, message = 'Recurso já existe') {
  return error(res, message, 409);
}

module.exports = {
  success,
  error,
  notFound,
  unauthorized,
  badRequest,
  conflict
};

