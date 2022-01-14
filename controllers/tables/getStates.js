const getDB = require('../../database/getDB');

const getStates = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        /* Obtenemos todos los nombres de provincias de nuestra base de datos */
        const [states] = await connection.query(`SELECT name FROM states`);

        /* Enviamos los nombres de las provincias */

        res.send({
            status: 'ok',
            data: {
                state: states,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = getStates;
