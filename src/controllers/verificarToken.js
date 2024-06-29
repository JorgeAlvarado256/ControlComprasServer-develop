const jwt = require('jsonwebtoken');

// Middleware de autenticación
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.error('No se encontró token en la cabecera de autorización');
    return res.sendStatus(401); // No hay token en la cabecera
  }

  console.log(`Token recibido: ${token}`);

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      console.error('Error al verificar el token:', err);
      return res.sendStatus(403); // Token inválido o expirado
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;