const getDB = require('../../database/getDB');

const getReviews = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        /* Obtenemos todos los nombres de los trabajos de nuestra base de datos */
        const [reviews] = await connection.query(`
        SELECT *, review.id, idStates, business.idUser, states.nameStates, avg(enviroment), avg(salary), avg(oportunities), avg(conciliation) FROM review
LEFT JOIN business_states ON (idBusiness_states = business_states.id)
LEFT JOIN business ON (review.idBusiness = business.id )
LEFT JOIN states ON (idStates = states.id)
GROUP BY review.id
                ORDER BY enviroment,salary,oportunities,conciliation asc              LIMIT  10`);

        /* Enviamos los nombres de los trabajos */

        res.send({
            status: 'ok',
            data: {
                reviews: reviews,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = getReviews;
