const getDB = require('../../database/getDB');

const searchBusiness = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        /* Obtenemos los query params de las empresas que se seleccionarán */
        const { idSalaries, idJobs, idStates, orderBy, direction } = req.body;

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
        const order = validOrderOptions.includes(orderBy)
            ? orderBy
            : 'review.createdAt';

        /* Lo mismo pero con "direction" */
        const orderDirection = validDirectionOptions.includes(direction)
            ? direction
            : 'desc';

        /* Variable donde almacenamos las empresas */
        let business;

        /* Variable donde almacenamos el top de empresas */

        /* 
        [topBusiness] = await connection.query(
            `SELECT idBusiness, avg(enviroment), avg(salary),avg(oportunities), avg(conciliation), avg(enviroment+salary+oportunities+conciliation)/4 AS votes 
FROM review
GROUP BY idBusiness
ORDER BY votes desc
limit 2`
        ); */

        /* Si existe algún párametro de filtrado */
        if (idSalaries | idJobs | idStates) {
            let idBusiness_states;

            [idBusiness_states] = await connection.query(
                `SELECT id FROM business_states
                WHERE idStates LIKE ?`,
                [idStates]
            );
            let ids = [];

            ids = idBusiness_states.map((id) => [...ids, id.id]);
            console.log('orderBy en back', orderBy);
            console.log('order en back', order);

            [business] = await connection.query(
                `SELECT *, states.nameStates, business.idUser, jobs.name as job, business.name, review.description, salary_range FROM review  
                 LEFT JOIN business_states ON (idBusiness_states = business_states.id)
                 LEFT JOIN business ON (review.idBusiness = business.id )
                 LEFT JOIN states ON (business_states.idStates = states.id)
                 LEFT JOIN jobs ON (review.idJobs = jobs.id)
                 LEFT JOIN salaries_range ON (review.idSalaries = salaries_range.id)
                 WHERE -1=-1 ${idJobs ? `AND idJobs IN (${idJobs})  ` : ''}${
                    idStates ? `AND idBusiness_states IN (${ids})` : ''
                }${idSalaries ? ` AND idSalaries IN (${idSalaries})` : ''}
                 GROUP BY review.id
                ORDER BY ${order} ${orderDirection}
               
                `
            );
            console.log(business);
        } else {
            [business] = await connection.query(
                `SELECT *,review.id, review.description, idStates, business.idUser, states.nameStates FROM review  
                 LEFT JOIN business_states ON (idBusiness_states = business_states.id)
                 LEFT JOIN business ON (review.idBusiness = business.id )
                 LEFT JOIN states ON (idStates = states.id)
                GROUP BY review.id
                ORDER BY ${order} ${orderDirection}
                `
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
