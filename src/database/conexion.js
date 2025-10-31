import { createPool } from 'mysql2/promise';

export const pool = createPool({
    host: 'localhost',
    user: 'luisa',
    password: '',
    port: 3306,
    database: 'prenderia'
});