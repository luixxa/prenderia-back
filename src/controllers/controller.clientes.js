import { pool } from '../database/conexion.js';

export const registrarCliente = async (req, res) => {
    try {
        let { identificacion, nombres, direccion, telefono, fecha_nac, password } = req.body;
        let sql = 'insert into clientes (identificacion, nombres, direccion, telefono, fecha_nac, password) values (?, ?, ?, ?, ?,?)';

        const [result] = await pool.query(sql, [identificacion, nombres, direccion, telefono, fecha_nac, password]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Cliente registrado exitosamente' });
        } else {
            res.status(400).json({ message: 'Error al registrar el cliente' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al realizar el registro:' + e, status: 500 });
    }
};

export const validarUsuario = async (req, res) => {
    // Lógica para validar usuario
};

export const listarClientes = async (req, res) => {
    try {
        const [result] = await pool.query('select * from clientes');
        if (result.length > 0) {
            res.status(200).json(result);

        } else {
            res.status(404).json({ message: 'No hay clientes registrados' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al listar los clientes:' + e, status: 500 });
    }
};

export const actualizarCliente = async (req, res) => {
    try {
        const { nombres, direccion, telefono, fecha_nac, password } = req.body;
        let identificacion = req.params.identificacion;
        let sql = 'UPDATE clientes SET nombres = ?, direccion = ?, telefono = ?, fecha_nac = ?, password = ? WHERE identificacion = ?';

        const [result] = await pool.query(sql, [nombres, direccion, telefono, fecha_nac, password, identificacion]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Cliente actualizado exitosamente' });
        } else {
            res.status(400).json({ message: 'Error al actualizar el cliente' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al actualizar el cliente: ' + e, status: 500 });
    }
};

export const eliminarCliente = async (req, res) => {
    try {
        let identificacion = req.params.identificacion;
        const [result] = await pool.query('DELETE FROM clientes WHERE identificacion = ?', [identificacion]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Cliente eliminado exitosamente' });
        } else {
            res.status(404).json({ message: 'No se encontró el cliente' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al eliminar el cliente: ' + e, status: 500 });
    }
};