const getDB = require('../../database/getDB');

const searchBusiness = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        /* Obtenemos los query params de las empresas que se seleccionarán */
        const {
            idSalaries,
            idJobs,
            idBusiness_states,
            idSector,
            order,
            direction,
        } = req.body;

        /* posibles valores para "order" */
        const validOrderOptions = [
            'salary',
            'enviroment',
            'conciliation',
            'oportunities',
            'createdAt',
        ];

        /* posibles valores para "direction" */
        const validDirectionOptions = ['desc', 'asc'];

        /* Establecemos el orden por defecto en caso de que no haya query params (undefined)
        o su valor sea incorrecto */
        const orderBy = validOrderOptions.includes(order)
            ? order
            : 'review.createdAt';

        /* Lo mismo pero con "direction" */
        const orderDirection = validDirectionOptions.includes(direction)
            ? direction
            : 'desc';

        /* Variable donde almacenamos las empresas */
        let business;

        /* Variable donde almacenamos el top de empresas */
        let topBusiness;
        /* 
        [topBusiness] = await connection.query(
            `SELECT idBusiness, avg(enviroment), avg(salary),avg(oportunities), avg(conciliation), avg(enviroment+salary+oportunities+conciliation)/4 AS votes 
FROM review
GROUP BY idBusiness
ORDER BY votes desc
limit 2`
        ); */

        /* Si existe algún párametro de filtrado */
        if (idSalaries | idJobs | idBusiness_states | idSector) {
            [business] = await connection.query(
                `SELECT *, states.name, business.idUser FROM review  
                 LEFT JOIN business_states ON (idBusiness_states = business_states.id)
                 LEFT JOIN business ON (review.idBusiness = business.id )
                 WHERE idSalaries LIKE ? OR idJobs LIKE ? OR idBusiness_states LIKE ? OR idSector LIKE ? 
                 GROUP BY review.id
                ORDER BY ${orderBy} ${orderDirection}
                LIMIT 10`,
                [idSalaries, idJobs, idBusiness_states, idSector]
            );
        } else {
            [business] = await connection.query(
                `SELECT *,review.id, review.description, idStates, business.idUser, states.nameStates FROM review  
                 LEFT JOIN business_states ON (idBusiness_states = business_states.id)
                 LEFT JOIN business ON (review.idBusiness = business.id )
                 LEFT JOIN states ON (idStates = states.id)
                GROUP BY review.id
                ORDER BY ${orderBy} ${orderDirection}
                LIMIT 10`
            );
        }

        res.send({
            status: 'ok',
            data: { business },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = searchBusiness;
