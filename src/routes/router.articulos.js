import express from 'express';
import {
    registrarArticulos,
    listarArticulos,
    buscarArticulos,
    actualizarArticulos,
    eliminarArticulos
} from '../controllers/controller.articulos.js';

const router = express.Router();

router.post('/registrar', registrarArticulos);
router.get('/listar', listarArticulos);
router.get('/buscar/:idarticulo', buscarArticulos);
router.put('/actualizar/:idarticulo', actualizarArticulos);
router.delete('/eliminar/:idarticulo', eliminarArticulos);

export default router;