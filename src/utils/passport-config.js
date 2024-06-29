const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Usuario } = require('../models/UsuarioModel');

passport.use(new LocalStrategy(
  async (rut_usuario, contraseña, done) => {
    try {
      const usuario = await Usuario.findOne({ where: { rut_usuario: rut_usuario } });

      if (!usuario || !usuario.validarContraseña(contraseña)) {
        return done(null, false, { message: 'Nombre de usuario o contraseña incorrectos' });
      }

      return done(null, usuario);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((usuario, done) => {
  done(null, usuario.id_usuario);
});

passport.deserializeUser(async (id_usuario, done) => {
  try {
    const usuario = await Usuario.findByPk(id_usuario);
    done(null, usuario);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
