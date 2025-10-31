import { pool } from '../database/conexion.js';

export const registrarAlquiler = async (req, res) => {
    // Lógica para registrar alquiler
};

export const listarAlquileres = async (req, res) => {
    // Lógica para listar alquileres
};

export const buscarAlquiler = async (req, res) => {
    // Lógica para buscar un alquiler
};

export const actualizarAlquiler = async (req, res) => {
    // Lógica para actualizar un alquiler
};

export const eliminarAlquiler = async (req, res) => {
    // Lógica para eliminar un alquiler
};

export const listarArticulosRentadosPorCliente = async (req, res) => {
    try {
        const { identificacion } = req.params; // Obtenemos la identificación del cliente desde los parámetros

        // Consulta SQL para obtener el nombre del artículo, el cliente y cuántas veces fue rentado
        const sql = `
            SELECT 
                a.nombre AS articulo,
                c.nombres AS cliente,
                COUNT(al.idalquiler) AS veces_rentado
            FROM alquiler al
            INNER JOIN articulos a ON al.articulo = a.idarticulo
            INNER JOIN clientes c ON al.cliente = c.identificacion
            WHERE c.identificacion = ?
            GROUP BY a.nombre, c.nombres
            ORDER BY veces_rentado DESC;
        `;

        // Ejecutamos la consulta con el parámetro identificacion
        const [result] = await pool.query(sql, [identificacion]);

        // Verificamos si se encontraron resultados
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'No se encontraron registros de alquileres para la identificación proporcionada' });
        }
    } catch (e) {
        console.error('Error al listar los artículos rentados por cliente:', e.message);
        res.status(500).json({ message: 'Error interno del servidor', detalle: e.message });
    }
};
