const getDB = require('../database/getDB');

const businessExists = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos el id de la empresa.
        const { idBusiness } = req.params;

        // Obtenemos la empresa
        const [business] = await connection.query(
            `SELECT id FROM business WHERE id = ? AND deleted = false`,
            [idBusiness]
        );

        // Si la empresa no existe lanzamos un error.
        if (business.length < 1) {
            const error = new Error('El usuario de empresa no existe');
            error.httpStatus = 404;
            throw new error();
        }

        // Pasamos el control a la siguiente función.
        next();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = businessExists;
