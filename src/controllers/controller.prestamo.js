import { pool } from "../database/conexion.js";

const registrarPrestamo = async (req, res) => {
    try {
        const { idCliente, montoTotal, fechaPrestamo, estadoPrestamo, plazoMeses } = req.body;
        
        const sql = `INSERT INTO prestamos (id_cliente, monto_total, fecha_prestamo, 
            estado_prestamo, plazo_meses) VALUES (?, ?, ?, ?, ?)`;
        
        const [rows] = await pool.query(sql, [
            idCliente, 
            montoTotal, 
            fechaPrestamo, 
            estadoPrestamo, 
            plazoMeses
        ]);

        res.status(201).json({
            "status": 201,
            "message": "Préstamo registrado exitosamente"
        });

    } catch (error) {
        res.status(500).json({
            "status": 500,
            "message": "Error al registrar el préstamo: " + error.message
        });
    }
};

const listarPrestamos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM prestamos');
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            "status": 500,
            "message": "Error al listar préstamos: " + error.message
        });
    }
};

const consultarPrestamo = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM prestamos WHERE id_prestamo = ?', [id]);
        
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({
                "status": 404,
                "message": "Préstamo no encontrado"
            });
        }
    } catch (error) {
        res.status(500).json({
            "status": 500,
            "message": "Error al consultar el préstamo: " + error.message
        });
    }
};

const actualizarPrestamo = async (req, res) => {
    try {
        const { id } = req.params;
        const { montoTotal, estadoPrestamo, plazoMeses } = req.body;

        const sql = `UPDATE prestamos SET monto_total = ?, estado_prestamo = ?, 
            plazo_meses = ? WHERE id_prestamo = ?`;
            
        const [result] = await pool.query(sql, [montoTotal, estadoPrestamo, plazoMeses, id]);

        if (result.affectedRows > 0) {
            res.json({
                "status": 200,
                "message": "Préstamo actualizado exitosamente"
            });
        } else {
            res.status(404).json({
                "status": 404,
                "message": "Préstamo no encontrado"
            });
        }
    } catch (error) {
        res.status(500).json({
            "status": 500,
            "message": "Error al actualizar el préstamo: " + error.message
        });
    }
};

const eliminarPrestamo = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM prestamos WHERE id_prestamo = ?', [id]);

        if (result.affectedRows > 0) {
            res.json({
                "status": 200,
                "message": "Préstamo eliminado exitosamente"
            });
        } else {
            res.status(404).json({
                "status": 404,
                "message": "Préstamo no encontrado"
            });
        }
    } catch (error) {
        res.status(500).json({
            "status": 500,
            "message": "Error al eliminar el préstamo: " + error.message
        });
    }
};

export {
    registrarPrestamo,
    listarPrestamos,
    consultarPrestamo,
    actualizarPrestamo,
    eliminarPrestamo
};