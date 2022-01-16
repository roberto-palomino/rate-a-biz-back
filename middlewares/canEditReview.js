const getDB = require('../database/getDB');

const canEditReview = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos el id de la review.
        const { idComment: idReview } = req.params;

        // Obtenemos el id del usuario que ha creado la review.
        const [reviews] = await connection.query(
            `SELECT idUser FROM reviews WHERE id = ?`,
            [idReview]
        );

        // Si el usuario que realiza la request no es el propietario
        // lanzamos un error.
        if (req.userAuth.id !== reviews[0].idUser) {
            const error = new Error('No tienes suficientes permisos');
            error.httpStatus = 403;
            throw error;
        }

        // Pasamos el control a la siguiente función.
        next();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = canEditReview;
