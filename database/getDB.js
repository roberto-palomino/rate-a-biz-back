require('dotenv').config();

const mysql = require('mysql2/promise');

/* Obtenemos las propiedades de nuestra base de datos */
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

let pool;

/* Función asincrona que nos retorna una conexión libre a la base de datos */
const getDB = async () => {
    /* Comprobamos que no haya conexión */
    if (!pool) {
        /* Creamos un grupo de conexiones, y las limitamos a 10 */
        pool = mysql.createPool({
            connectionLimit: 10,
            host: MYSQL_HOST,
            user: MYSQL_USER,
            password: MYSQL_PASSWORD,
            database: MYSQL_DATABASE,
            timezone: 'Z',
        });

        /* Retornamos una conexión libre */
        return await pool.getConnection();
    }
};

module.exports = getDB;
