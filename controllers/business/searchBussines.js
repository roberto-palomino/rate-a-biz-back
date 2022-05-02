const getDB = require('../../database/getDB');

const searchBusiness = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        /* Obtenemos los query params de las empresas que se seleccionarán */
        const { idSalaries, idJobs, idStates, orderBy, direction, name } =
            req.body;

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

        /* Variable donde almacenamos las empresas si existe alguna review con ese nombre*/
        let businessName;

        /* Query que busca si hay reviews con ese nombre */

        [businessName] = await connection.query(
            `SELECT idBusiness FROM review
            LEFT JOIN  business ON (review.idBusiness = business.id)
            WHERE business.name LIKE ?`,
            [name]
        );

        /* Variable donde almacenamos las empresas */
        let business;

        /* Si no hay reviews con ese nombre, obtenemos toda la información de la empresa */
        let businessNo;
        if (businessName.length === 0) {
            [businessNo] = await connection.query(
                `SELECT * FROM business
                LEFT JOIN users ON (business.idUser = users.id)
                WHERE business.name LIKE ?`,
                [name]
            );

            /* Si existe algún párametro de filtrado */
        }

        let idBusiness_states;

        [idBusiness_states] = await connection.query(
            `SELECT id FROM business_states
                WHERE idStates LIKE ?`,
            [idStates]
        );
        let ids = [];

        ids = idBusiness_states.map((id) => [...ids, id.id]);

        [business] = await connection.query(
            `SELECT *, users.avatar, states.nameStates, business.idUser, jobs.name as job, business.name, review.description, salary_range FROM review  
                 LEFT JOIN business_states ON (idBusiness_states = business_states.id)
                 LEFT JOIN business ON (review.idBusiness = business.id )
                 LEFT JOIN states ON (business_states.idStates = states.id)
                 LEFT JOIN jobs ON (review.idJobs = jobs.id)
                 LEFT JOIN salaries_range ON (review.idSalaries = salaries_range.id)
                 LEFT JOIN users ON (business.idUser = users.id)
                 WHERE -1=-1 ${idJobs ? `AND idJobs IN (${idJobs})  ` : ''}${
                idStates ? `AND idBusiness_states IN (${ids})` : ''
            }${idSalaries ? ` AND idSalaries IN (${idSalaries})` : ''} ${
                name ? `AND business.name LIKE ("${name}")` : ''
            }
                 GROUP BY review.id
                ORDER BY ${order} ${orderDirection}
               
                `
        );
        /* else {
            [business] = await connection.query(
                `SELECT *,business.name, users.avatar,review.id, review.description, idStates, business.idUser, states.nameStates FROM review  
                 LEFT JOIN business_states ON (idBusiness_states = business_states.id)
                 LEFT JOIN business ON (review.idBusiness = business.id )
                 LEFT JOIN states ON (idStates = states.id)
                 LEFT JOIN users ON (business.idUser = users.id)
                GROUP BY review.id
                ORDER BY ${order} ${orderDirection}
                LIMIT 15
                `
            );
        } */
        if (business.length > 0) {
            res.send({
                status: 'ok',
                data: { business },
            });
        } else {
            res.send({
                status: 'ok',
                data: { business, businessNo },
            });
        }
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = searchBusiness;
