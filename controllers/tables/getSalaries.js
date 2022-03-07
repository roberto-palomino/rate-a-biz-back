const getDB = require('../../database/getDB');

const getSalaries = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        /* Obtenemos todos los rangos salariales de nuestra base de datos */
        const [salaries] = await connection.query(
            `SELECT id, salary_range FROM salaries_range`
        );

        /* Enviamos los rangos salariales*/

        res.send({
            status: 'ok',
            data: {
                salaries_range: salaries,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = getSalaries;
