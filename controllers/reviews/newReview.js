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
            idStates,
            idJobs,
            idSalaries,
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

        //obtenemos el id de business.
        const { idBusiness } = req.params;

        const [identifier] = await connection.query(
            `SELECT id FROM Business_states WHERE idBusiness = ? and idStates = ?`,
            [idBusiness, idStates]
        );

        if (identifier.length > 0) {
            // Creamos la entrada y obtenemos el valor que retorna "connection.query".
            const [newReview] = await connection.query(
                `INSERT INTO reviews (idBusiness_states, idUser, idJobs, idSalaries, start_year,
                            end_year,
                            salary,
                            enviroment,
                            conciliation,
                            oportunities,
                            title,
                            description, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    identifier[0].id,
                    idReqUser,
                    idJobs,
                    idSalaries,
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
        } else {
            await connection.query(
                `INSERT INTO business_states (idBusiness, idStates, createdAt) VALUES (?, ?, ?)`,
                [idBusiness, idStates, new Date()]
            );
            const [newIdBusiness] = await connection.query(
                `SELECT id FROM Business_states WHERE idBusiness = ? and idStates = ?`,
                [idBusiness, idStates]
            );
            await connection.query(
                `INSERT INTO reviews (idBusiness_states, idUser, idJobs, idSalaries, start_year,
                            end_year,
                            salary,
                            enviroment,
                            conciliation,
                            oportunities,
                            title,
                            description, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    newIdBusiness[0].id,
                    idReqUser,
                    idJobs,
                    idSalaries,
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
        }

        // Obtenemos el id de la entrada que acabamos de crear.
        const idReview = newReview.insertId;

        res.send({
            status: 'ok',
            message: 'La review ha sido creada',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = newReview;
