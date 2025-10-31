import express from 'express';
import {
    registrarInteres,
    listarIntereses,
    buscarInteres,
    actualizarInteres,
    eliminarInteres
} from '../controllers/controller.intereses.js';

const router = express.Router();

router.post('/registrar', registrarInteres);
router.get('/listar', listarIntereses);
router.get('/buscar/:idinteres', buscarInteres);
router.put('/actualizar/:idinteres', actualizarInteres);
router.delete('/eliminar/:idinteres', eliminarInteres);

export default router;