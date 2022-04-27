const getDB = require('../../database/getDB');

const getTopBusiness = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        /* Variable donde almacenamos el top de empresas */
        let topBusiness;

        [topBusiness] = await connection.query(
            `SELECT COUNT(review.idBusiness) as total, users.avatar,users.id, review.idBusiness, business.name, avg(enviroment) as enviroment, avg(salary) as salary,avg(oportunities) as oportunities, avg(conciliation) as conciliation, avg(enviroment+salary+oportunities+conciliation)/4 AS votes 
FROM review
LEFT JOIN business ON (review.idBusiness = business.id )
LEFT JOIN users ON (business.idUser = users.id)
GROUP BY review.idBusiness
ORDER BY votes desc
limit 10`
        );
        /* Variable para almacenar los IDs del top de empresas */
        let businessId = [];
        /* Cogemos el array con el top de empresas, y creamos un array con sus IDs */
        businessId = topBusiness.map((business) => [
            ...businessId,
            business.idBusiness,
        ]);

        /* Obtenemos las reviews que coincidan con los IDs del top de empresas */
        const [reviews] = await connection.query(
            `
        SELECT *, review.description, review.id,review.idBusiness, idStates, business.idUser, states.nameStates, (avg(enviroment)+ avg(salary)+ avg(oportunities)+ avg(conciliation))/4 as votes 
FROM review
LEFT JOIN business_states ON (idBusiness_states = business_states.id)
LEFT JOIN business ON (review.idBusiness = business.id )
LEFT JOIN states ON (idStates = states.id)
WHERE review.idBusiness in (?)
GROUP BY review.id
                ORDER BY review.id   desc         `,
            [businessId]
        );

        /* Enviamos un array con el top de empresas y otro con sus reviews */

        res.send({
            status: 'ok',
            data: {
                reviews: reviews,
                topBusiness: topBusiness,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = getTopBusiness;
