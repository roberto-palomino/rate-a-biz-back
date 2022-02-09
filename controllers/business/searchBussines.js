const getDB = require('../../database/getDB');

const searchBusiness = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        /* Obtenemos los query params de las empresas que se seleccionarán */
        const { idSalaries, idJobs, idBussines_states, order, direction } =
            req.query;

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
        const orderBy = validOrderOptions.includes(order) ? order : 'createdAt';

        /* Lo mismo pero con "direction" */
        const orderDirection = validDirectionOptions.includes(direction)
            ? direction
            : 'desc';

        /* Variable donde almacenamos las empresas */
        let business;

        /* Si existe algún párametro de filtrado */
        if (idSalaries | idJobs | idBussines_states) {
            [business] = await connection.query(
                `SELECT * FROM reviews 
                LEFT JOIN bussines_states ON (idBusiness_states = bussines_states.id)
                LEFT JOIN bussines ON (bussines.id = idBussines)
                WHERE idSalaries LIKE ? OR idJobs LIKE ? OR idBussines_states LIKE ?
                GROUP BY reviews.id
                ORDER BY ${orderBy} ${orderDirection}
                LIMIT 10`,
                [idSalaries, idJobs, idBussines_states]
            );
        } else {
            [business] = await connection.query(
                `SELECT * FROM reviews 
                LEFT JOIN bussines_states ON (idBusiness_states = bussines_states.id)
                LEFT JOIN bussines ON (bussines.id = idBussines)
                GROUP BY reviews.id
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
