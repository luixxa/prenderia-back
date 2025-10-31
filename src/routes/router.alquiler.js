import express from 'express';
import {
    registrarAlquiler,
    listarAlquileres,
    buscarAlquiler,
    actualizarAlquiler,
    eliminarAlquiler
} from '../controllers/controller.alquiler.js';

const router = express.Router();

router.post('/registrar', registrarAlquiler);
router.get('/listar', listarAlquileres);
router.get('/buscar/:idalquiler', buscarAlquiler);
router.put('/actualizar/:idalquiler', actualizarAlquiler);
router.delete('/eliminar/:idalquiler', eliminarAlquiler);

export default router;