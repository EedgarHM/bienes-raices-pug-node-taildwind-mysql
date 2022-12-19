

import express from 'express';
import { admin, crearPropiedad } from '../controllers/propiedadesController.js'

const router = express.Router()

router.get('/mis-propiedades', admin)
router.get('/propiedades/crear-propiedad', crearPropiedad)

export default router