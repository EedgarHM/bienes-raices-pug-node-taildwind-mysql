import { check, validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


import Usuario from "../models/UsuarioModel.js";
import { generarId, generarJWT } from "../helpers/tokens.js";
import { emailRegistro, recuperarPasssword } from "../helpers/emails.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesion",
    csrfToken: req.csrfToken()
  });
};

const autenticar = async (req, res) => {
  
  await check("email")
  .isEmail()
  .withMessage("El Email es obligatorio")
  .run(req);

  await check("password")
  .notEmpty()
    .withMessage("El password es obligatorio")
    .run(req);

    let resultValidation = validationResult(req);

    if (!resultValidation.isEmpty()) {
      return res.render("auth/login", {
        // Sending data to view
        pagina: "Iniciar Sesion",
        csrfToken: req.csrfToken(),
        errores: resultValidation.array()
      });
    }


    const { email, password } = req.body;
    
    // comprobar si el usuario existe o nel 
    const usuario = await Usuario.findOne({where: { email }})

    if(!usuario){
      return res.render("auth/login", {
        pagina: "Iniciar Sesion",
        csrfToken: req.csrfToken(),
        errores: [{msg:"El usuario no existe"}]
      });
    }

    // comprobar si el usuario confirmo su cuenta
    if(!usuario.confirmado){
      return res.render("auth/login", {
        pagina: "Iniciar Sesion",
        csrfToken: req.csrfToken(),
        errores: [{msg:"Tu cuenta no esta confirmada aun, revisa tu correo."}]
      });
    }

    // comprobar la contrasenia
    console.log(usuario.verificarPassword(password));

    if(!usuario.verificarPassword(password)){
        return res.render("auth/login", {
          pagina: "Iniciar Sesion",
          csrfToken: req.csrfToken(),
          errores: [{msg:"Credenciales incorrectas"}]
        });
    }

    const token = generarJWT({id:usuario.id, nombre:usuario.nombre})

    // Almacenar token en las cookies
    return res.cookie('_token', token, {
      httpOnly: true
    }).redirect('/mis-propiedades')

    console.log(token);
  }


const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    // Sending data to view
    pagina: "Crear Cuenta",
    csrfToken: req.csrfToken(),
  });
};

const registrar = async (req, res) => {
  // validacion de campos
  await check("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .run(req);

  await check("email")
    .isEmail()
    .withMessage("Parece no ser un buen Email")
    .run(req);

  await check("password")
    .isLength({ min: 6 })
    .withMessage("El password debe tener por lo menos 6 caracteres")
    .run(req);

  await check("repetir_password")
    .equals(req.body.password)
    .withMessage("Los Passwords no son iguales")
    .run(req);

  let resultValidation = validationResult(req);

  if (!resultValidation.isEmpty()) {
    return res.render("auth/registro", {
      // Sending data to view
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errores: resultValidation.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }

  // verificar si ya existe el usuario
  const existeUsuario = await Usuario.findOne({
    where: { email: req.body.email },
  });

  if (existeUsuario) {
    return res.render("auth/registro", {
      // Sending data to view
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El usuario ya esta registrado" }],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }

  // guardando usuario
  const usuario = await Usuario.create({
    nombre: req.body.nombre,
    email: req.body.email,
    password: req.body.password,
    token: generarId(),
  });

  // enviando email de confirmacion
  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token,
  });

  // mostrar mensaje de registro exitosos
  res.render("templates/mensaje", {
    pagina: "Cuenta Creada Correctamente",
    mensaje: "Hemos enviado un mensaje de confirmacion, presiona en el enlace",
  });
};

const confirmarEmail = async (req, res) => {
  const { token } = req.params;

  // verificar si el token es valido
  const usuario = await Usuario.findOne({ where: { token } });

  if (!usuario) {
    return res.render("auth/confirmar-cuenta", {
      pagina: "Error al confirmar tu cuenta",
      mensaje:
        "Hubo un error al confirmar tu cuenta, por favor intenta de nuevo ",
      error: true,
    });
  }

  usuario.token = null;
  usuario.confirmado = true;

  await usuario.save();

  res.render("auth/confirmar-cuenta", {
    pagina: "Cuenta Confirmada",
    mensaje: "Se ha confirmado tu cuenta, ya puedes hacer uso de ella C: ",
    error: false,
  });
};

const formularioRecuperacionPassword = (req, res) => {
  res.render("auth/recuperar-password", {
    pagina: "Recuperar Password",
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req, res) => {
  await check("email")
    .isEmail()
    .withMessage("Eso no parece ser un email")
    .run(req);

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    return res.render("auth/recuperar-password", {
      pagina: "Recuperar Password",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  const { email } = req.body;
  // Buscando al usuario si se pasan las validaciones
  const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario) {
    return res.render("auth/recuperar-password", {
      pagina: "Recuperar Password",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El Email no pertenece a ningun usuario" }],
    });
  }

  // Generar token y enviar email si el usuario si existe
  usuario.token = generarId();
  await usuario.save();

  // Enviar Email
  recuperarPasssword({
    email: usuario.email,
    nombre: usuario.nombre,
    token: usuario.token,
  });

  // mostrar mensaje de registro exitosos
  res.render("templates/mensaje", {
    pagina: "Reestablece tu Password",
    mensaje:
      "Hemos enviado un email con las instrucciones para recuperar tu password",
  });
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const usuario = await Usuario.findOne({ where: { token } });

  if (!usuario) {
    return res.render("auth/confirmar-cuenta", {
      pagina: "Reestablece tu password",
      mensaje: "Hubo un error al validar tu informacion, intenta nuevamente. ",
      error: true,
    });
  }

  // Mostrando el formulario para que se cree una nueva contrasenia
  res.render('auth/recovery-password', {
    pagina: 'Reestablece tu password',
    
    csrfToken: req.csrfToken(),
  })

};
const nuevoPassword = async (req,res) => {

  // validar password
  await check("password")
    .isLength({ min: 6 })
    .withMessage("El password debe tener por lo menos 6 caracteres")
    .run(req);

    let resultValidation = validationResult(req);

  if (!resultValidation.isEmpty()) {
    return res.render("auth/recovery-password", {
      // Sending data to view
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errores: resultValidation.array()
    });
  }

  // Indentificar quien hace el cambio 
  const { token } = req.params
  const { password } = req.body

  const usuario = await Usuario.findOne({where : {token}})

  // Hashear password
  const salt = await bcrypt.genSalt(10)
  usuario.password = await bcrypt.hash(password, salt)
  usuario.token = null;

  await usuario.save();

  res.render('auth/confirmar-cuenta', {
    pagina: 'Password Reestablecido',
    mensaje: 'Se realizo el cambio correctamente'
  })
};


export {
  formularioLogin,
  autenticar,
  formularioRegistro,
  registrar,
  confirmarEmail,
  formularioRecuperacionPassword,
  resetPassword,
  comprobarToken,
  nuevoPassword,
};
