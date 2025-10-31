import jwt from 'jsonwebtoken';
import { pool } from '../src/database/conexion.js';

export const validarUsuario = async (req, res) => {
    try {
        const { identificacion, password } = req.body;

        const [result] = await pool.query(
            `SELECT identificacion, nombres, direccion, telefono, fecha_nac, password 
            FROM clientes WHERE identificacion = ? AND password = ?`,
            [identificacion, password]
        );

        if (result.length > 0) {
            const cliente = result[0];
            console.log('Cliente encontrado:', cliente);

            const token = jwt.sign(
                {
                    identificacion: cliente.identificacion,
                    nombre: cliente.nombres,
                    direccion: cliente.direccion,
                    telefono: cliente.telefono
                },
                "palabraclave",
                { expiresIn: '8h' }
            );

            res.status(200).json({ cliente, token });
        } else {
            res.status(404).json({ message: 'Cliente no autorizado', status: 404 });
        }

    } catch (error) {
        console.log("Error en controller.authentication.js: " + error.message);
        res.status(500).json({ error: 'Error al validar cliente', detalle: error.message });
    }
};



// Middleware para validar el token
export const validarToken = async (req, res, next) => {
    try {
        // Captura el encabezado de la autorización
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(403).json({ status: 403, message: 'Token es requerido' });
        }

        // Extrae el token
        const token = authHeader.split(' ')[1]; // Dividimos en "Bearer <token>" y tomamos solo el token

        if (!token) {
            return res.status(403).json({ status: 403, message: 'Token es requerido' });
        }

        // Verifica el token con jwt
        jwt.verify(token, "palabraclave", (error, decoded) => {
            if (error) {
                return res.status(403).json({
                    status: 403,
                    message: "Token inválido o expirado",
                });
            }
            req.user = decoded; // Guarda los datos decodificados en la solicitud
            next(); // Continúa con la siguiente función
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error interno del servidor: " + error.message,
        });
    }
};
export const registrarClienteToken = async (req, res) => {
    try {
        // Extraemos los datos del cuerpo de la solicitud
        const { identificacion, nombres, direccion, telefono, fecha_nac, password } = req.body;

        // Consulta para insertar el cliente en la base de datos
        const sql = `INSERT INTO clientes (identificacion, nombres, direccion, telefono, fecha_nac, password) 
                    VALUES (?, ?, ?, ?, ?,?)`;

        const [result] = await pool.query(sql, [identificacion, nombres, direccion, telefono, fecha_nac, password]);

        if (result.affectedRows > 0) {
            res.status(201).json({ message: 'Cliente registrado exitosamente' });
        } else {
            res.status(400).json({ message: 'Error al registrar el cliente' });
        }
    } catch (error) {
        console.error('Error al registrar cliente:', error.message);
        res.status(500).json({ message: 'Error interno del servidor', detalle: error.message });
    }
};
export const actualizarClienteConToken = async (req, res) => {
    try {
        // Ya no es necesario verificar el token, ya se validó en el middleware 'validarTokenMTM'
        const identificacion = req.user.identificacion; // Obtenemos la identificación del cliente del token

        // Datos a actualizar
        const { nombres, direccion, telefono, fecha_nac, password } = req.body;

        // SQL para actualizar el cliente
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
export const eliminarClienteConToken = async (req, res) => {
    try {
        const identificacion = req.params.identificacion;  // Obtener la identificación del cliente desde la URL

        // Consulta SQL para eliminar el cliente de la base de datos
        const [result] = await pool.query('DELETE FROM clientes WHERE identificacion = ?', [identificacion]);

        if (result.affectedRows > 0) {
            // Si el cliente fue eliminado exitosamente
            res.status(200).json({ message: 'Cliente eliminado exitosamente' });
        } else {
            // Si no se encontró el cliente
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (e) {
        // Manejo de errores
        console.error(e);
        res.status(500).json({ message: 'Error al eliminar el cliente: ' + e.message });
    }
};



export const listarClientesConToken = async (req, res) => {
    try {
        // Ya no es necesario verificar el token, ya se validó en el middleware 'validarTokenMTM'
        const identificacion = req.user.identificacion; // Obtenemos la identificación del cliente del token

        // SQL para listar todos los clientes
        const [result] = await pool.query('SELECT * FROM clientes');

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'No hay clientes registrados' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al listar los clientes: ' + e.message, status: 500 });
    }
};
export const registrararticuloConToken = async (req, res) => {
    try {
        // Extraemos los datos del cuerpo de la solicitud
        const { nombre, tipo } = req.body;

        // Consulta para insertar el cliente en la base de datos
        const sql = `INSERT INTO articulos (nombre, tipo) 
                    VALUES (?, ?)`;

        const [result] = await pool.query(sql, [nombre, tipo]);

        if (result.affectedRows > 0) {
            res.status(201).json({ message: 'Articulo registrado exitosamente' });
        } else {
            res.status(400).json({ message: 'Error al registrar el articulo' });
        }
    } catch (error) {
        console.error('Error al registrar articulo:', error.message);
        res.status(500).json({ message: 'Error interno del servidor', detalle: error.message });
    }
}
export const desactivarArticuloConToken = async (req, res) => {
    try {
        const id = req.params.idarticulo; // ID del artículo a desactivar
        const estado = 'inactivo'; // Estado para desactivar el artículo

        // Consulta SQL para actualizar el estado del artículo
        const sql = 'UPDATE articulos SET estado = ? WHERE idarticulo = ?';
        const [result] = await pool.query(sql, [estado, id]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Artículo desactivado exitosamente' });
        } else {
            res.status(400).json({ message: 'Error al desactivar el artículo o artículo no encontrado' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al desactivar el artículo: ' + e.message, status: 500 });
    }
};
export const registrarAlquilerConToken = async (req, res) => {
    try {
        // Obtenemos la identificación del cliente desde el token
        const clienteId = req.user.identificacion;

        // Extraemos los datos del cuerpo de la solicitud
        const { valor, fecha, meses, descripcion, interes,cliente, articulo } = req.body;

        // Consulta SQL para registrar el alquiler
        const sql = `INSERT INTO alquiler ( valor, fecha, meses, descripcion, interes, cliente, articulo) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await pool.query(sql, [valor, fecha, meses, descripcion, interes, cliente, articulo]);

        if (result.affectedRows > 0) {
            res.status(201).json({ message: 'Alquiler registrado exitosamente' });
        } else {
            res.status(400).json({ message: 'Error al registrar el alquiler' });
        }
    } catch (error) {
        console.error('Error al registrar alquiler:', error.message);
        res.status(500).json({ message: 'Error interno del servidor', detalle: error.message });
    }
};
export const actualizarAlquilerConToken = async (req, res) => {
    try {
        // Obtenemos la identificación del cliente desde el token
        const clienteId = req.user.identificacion;

        // Extraemos los datos del cuerpo de la solicitud
        const { valor, fecha, meses, descripcion, interes, cliente, articulo } = req.body;
        const idalquiler = req.params.idalquiler; // ID del alquiler a actualizar

        // Consulta SQL para actualizar el alquiler
        const sql = `UPDATE alquiler SET valor = ?, fecha = ?, meses = ?, descripcion = ?, interes = ?, cliente = ?, articulo = ? WHERE idalquiler = ?`;

        const [result] = await pool.query(sql, [valor, fecha, meses, descripcion, interes, cliente, articulo, idalquiler]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Alquiler actualizado exitosamente' });
        } else {
            res.status(400).json({ message: 'Error al actualizar el alquiler o alquiler no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar alquiler:', error.message);
        res.status(500).json({ message: 'Error interno del servidor', detalle: error.message });
    }
}
export const registrarInteresConToken = async (req, res) => {
    try {
        // Obtenemos la identificación del cliente desde el token
        const clienteId = req.user.identificacion;

        // Extraemos los datos del cuerpo de la solicitud
        const { mes ,fecha ,valor ,alquiler} = req.body;

        // Consulta SQL para registrar el interés
        const sql = `INSERT INTO intereses (mes ,fecha ,valor ,alquiler) 
                    VALUES (?, ?, ?, ?)`;

        const [result] = await pool.query(sql, [mes ,fecha ,valor ,alquiler]);

        if (result.affectedRows > 0) {
            res.status(201).json({ message: 'Interés registrado exitosamente' });
        } else {
            res.status(400).json({ message: 'Error al registrar el interés' });
        }
    } catch (error) {
        console.error('Error al registrar interés:', error.message);
        res.status(500).json({ message: 'Error interno del servidor', detalle: error.message });
    }
};
export const eliminarinteresconToken = async (req, res) => {
    try {
        // Obtenemos la identificación del cliente desde el token
        const clienteId = req.user.identificacion;

        // ID del interés a eliminar
        const idinteres = req.params.idintereses; // ID del interés a eliminar

        // Consulta SQL para eliminar el interés
        const sql = 'DELETE FROM intereses WHERE idintereses = ?';
        const [result] = await pool.query(sql, [idinteres]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Interés eliminado exitosamente' });
        } else {
            res.status(400).json({ message: 'Error al eliminar el interés o interés no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar interés:', error.message);
        res.status(500).json({ message: 'Error interno del servidor', detalle: error.message });
    }
}
export const listarInteresesPagadosCliente = async (req, res) => {
    try {
        // Obtenemos la identificación del cliente desde los parámetros de la URL
        const clienteId = req.params.identificacion;

        // Consulta SQL para obtener los intereses pagados
        const sql = `
            SELECT 
    c.nombres AS cliente,             -- el nombre del cliente
    a.idalquiler AS alquiler,         -- el ID del alquiler
    art.nombre AS articulo,           -- el nombre del artículo alquilado
    i.mes,                            -- el mes al que corresponde el interés
    i.valor                           -- el valor del interés pagado

            FROM intereses i
            INNER JOIN alquiler a ON i.alquiler = a.idalquiler
            INNER JOIN articulos art ON a.articulo = art.idarticulo
            INNER JOIN clientes c ON a.cliente = c.identificacion
            WHERE c.identificacion = ?;
        `;

        const [result] = await pool.query(sql, [clienteId]);

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'No se encontraron intereses pagados para este cliente' });
        }
    } catch (e) {
        console.error('Error al listar los intereses pagados:', e.message);
        res.status(500).json({ message: 'Error interno del servidor', detalle: e.message });
    }
};
export const listarTotalInteresesRecaudados = async (req, res) => {
    const { mes, anio } = req.params;
    try {
        const query = `
            SELECT 
                EXTRACT(MONTH FROM fecha) AS mes,
                EXTRACT(YEAR FROM fecha) AS anio,
                SUM(valor) AS total_interes
            FROM intereses
            WHERE 
                EXTRACT(MONTH FROM fecha) = ? AND
                EXTRACT(YEAR FROM fecha) = ?
            GROUP BY 
                EXTRACT(MONTH FROM fecha), EXTRACT(YEAR FROM fecha)
        `;
        const [result] = await pool.query(query, [mes, anio]);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al calcular intereses por mes y año:', error);
        res.status(500).json({ message: 'Error al calcular intereses por mes y año', error });
    }
};


export const listarInteresesPendientes = async (req, res) => {
    try {
        // Obtenemos el ID del alquiler desde los parámetros de la URL
        const { idalquiler } = req.params;

        // Consulta SQL para obtener los meses y el interés pendiente por pagar SOLO para el alquiler solicitado
        const sql = `
            SELECT 
    a.idalquiler,
    a.valor AS valor_alquiler,
    i.valor AS valor_interes,
    SUM(CASE WHEN i.estado = 'Pagado' THEN 1 ELSE 0 END) AS cantidad_pagados,
    SUM(CASE WHEN i.estado = 'Pendiente' THEN 1 ELSE 0 END) AS cantidad_pendientes
FROM alquiler a
INNER JOIN intereses i ON a.idalquiler = i.alquiler
WHERE a.idalquiler = ?
GROUP BY a.idalquiler, a.valor, i.valor;

        `;

        // Ejecutamos la consulta con el parámetro
        const [result] = await pool.query(sql, [idalquiler]);

        // Verificamos si se encontraron resultados
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'No se encontraron intereses pendientes para este alquiler' });
        }
    } catch (e) {
        console.error('Error al listar los intereses pendientes:', e.message);
        res.status(500).json({ message: 'Error interno del servidor', detalle: e.message });
    }
};


