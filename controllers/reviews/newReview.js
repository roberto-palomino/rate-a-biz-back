const getDB = require('../../database/getDB');

const newReviewSchema = require('../../schemas/newCommentSchema');

const { validate } = require('../../helpers');

const newReview = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Validamos las propiedades del body.
        await validate(newReviewSchema, req.body);

        // Obtenemos las propiedades del body.
        const {
            salary_range,
            start_year,
            end_year,
            salary,
            enviroment,
            conciliation,
            oportunities,
            title,
            description,
        } = req.body;

        // Obtenemos el id del usuario que está creando la review.
        const idReqUser = req.userAuth.id;

        // Obtenemos el id de la emrpesa sobre la que se está creando la review.
        const idReqBusiness = req.businessAuth.id;

        // Creamos la entrada y obtenemos el valor que retorna "connection.query".
        const [newReview] = await connection.query(
            `INSERT INTO reviews (idBusiness, idUser, idJobs, idSector, salary_range,
                start_year,
                end_year,
                salary,
                enviroment,
                conciliation,
                oportunities,
                title,
                description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                idReqBusiness,
                idReqUser,
                idJobs,
                idSector,
                salary_range,
                start_year,
                end_year,
                salary,
                enviroment,
                conciliation,
                oportunities,
                title,
                description,
                new Date(),
            ]
        );

        // Obtenemos el id de la entrada que acabamos de crear.
        const idReview = newReview.insertId;

        res.send({
            status: 'ok',
            message: 'La review ha sido creado',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = newReview;
