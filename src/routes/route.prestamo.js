import express from 'express';
import {
    registrarPrestamo,
    listarPrestamos,
    consultarPrestamo,
    actualizarPrestamo,
    eliminarPrestamo
} from '../controllers/controller.prestamos.js';

const router = express.Router();

// Rutas para préstamos
router.post('/registrar', registrarPrestamo);
router.get('/listar', listarPrestamos);
router.get('/consultar/:id', consultarPrestamo);
router.put('/actualizar/:id', actualizarPrestamo);
router.delete('/eliminar/:id', eliminarPrestamo);

export default router;