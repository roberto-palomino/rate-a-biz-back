const getDB = require('../../database/getDB');

const getSectors = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        /* Obtenemos todos los nombres de los sectores de nuestra base de datos */
        const [sectors] = await connection.query(
            `SELECT id, name FROM sectors`
        );

        /* Enviamos los nombres de los trabajos */

        res.send({
            status: 'ok',
            data: {
                sector: sectors,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = getSectors;
