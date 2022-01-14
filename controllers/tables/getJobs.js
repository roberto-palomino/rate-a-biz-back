const getDB = require('../../database/getDB');

const getJobs = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        /* Obtenemos todos los nombres de los trabajos de nuestra base de datos */
        const [jobs] = await connection.query(`SELECT name FROM jobs`);

        /* Enviamos los nombres de los trabajos */

        res.send({
            status: 'ok',
            data: {
                job: jobs,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = getJobs;
