import express from 'express';
import { 
    formularioLogin,
    formularioRegistro,
    formularioRecuperacionPassword,
    registrar,
    confirmarEmail,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    autenticar
} from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/login', formularioLogin)
router.post('/login', autenticar)

router.get('/registro',formularioRegistro)
router.post('/registro',registrar)

router.get('/confirmar/:token', confirmarEmail)

router.get('/recuperar-password',formularioRecuperacionPassword)
router.post('/recuperar-password',resetPassword)

// Almacena el nuevo password

router.get('/recuperar-password/:token',comprobarToken)
router.post('/recuperar-password/:token',nuevoPassword)

export default router