require('dotenv').config();

const mysql = require('mysql2/promise');

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

/* Creamos variable que almacenará un pool de conexiones */
let pool;

/* función que retorna una conexion a la base de datos */
const getDB = async () => {
    /* si no hay conexion... */
    if (!pool) {
        /* creamos un grupo de conexiones */
        pool = mysql.createPool({
            connectionLimit: 10,
            host: MYSQL_HOST,
            user: MYSQL_USER,
            password: MYSQL_PASSWORD,
            database: MYSQL_DATABASE,
            timezone:
                'Z' /* Esto guarda todas las entradas en la misma zona horaria, la hora zulú */,
        });
    }

    /* retornamos una conexion libre */
    return await pool.getConnection();
};

/* Exportamos la funcion */
module.exports = getDB;
