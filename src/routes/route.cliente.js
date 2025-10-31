import express from 'express';
import {
    registrarCliente,
    validarUsuario,
    listarClientes,
    actualizarCliente,
    eliminarCliente
} from '../controllers/controller.clientes.js';

const router = express.Router();

router.post('/registrar', registrarCliente);
router.post('/validar', validarUsuario);
router.get('/listar', listarClientes);
router.put('/actualizar/:idcliente', actualizarCliente);
router.delete('/eliminar/:idcliente', eliminarCliente);

export default router;

