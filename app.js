import express from "express";
import bodyParser from "body-parser";
import clientes from './src/routes/route.cliente.js'; // Ruta para clientes
import articulos from './src/routes/router.articulos.js'; // Ruta para artículos
import alquiler from './src/routes/router.alquiler.js'; // Ruta para alquiler
import intereses from './src/routes/route.intereses.js'; // Ruta para intereses
import prestamos from './src/routes/router.prestamos.js'; // Nueva importación
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 👇 Necesario para usar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: './.env'
});

const servidor = express();

servidor.use(cors());
servidor.use(express.static('public'));
servidor.use(bodyParser.json());
servidor.use(bodyParser.urlencoded({ extended: false }));

servidor.set('view engine', 'ejs');
servidor.set('views', 'src/views');

// Rutas principales
servidor.use('/cliente', clientes);
servidor.use('/articulo', articulos);
servidor.use('/alquiler', alquiler);
servidor.use('/interes', intereses);
servidor.use('/prestamo', prestamos); // Nueva ruta

// ✅ Ruta para servir el frontend (sin usar '*')
servidor.use((req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// 🚀 Iniciar servidor
servidor.listen(3000, () => {
    console.log("Servidor iniciado en el puerto 3000");
});
