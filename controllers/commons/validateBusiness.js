const getDB = require('../../database/getDB');

const validateBusiness = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();

        const { registrationCode } = req.params;

        const [business] = await connection.query(
            `SELECT id FROM business WHERE registrationCode = ?`,
            [registrationCode]
        );

        if (business.length < 1) {
            const error = new Error(
                'No hay nigun usuario pendiente de validar con ese codigo'
            );
            error.httpStatus = 404;
            throw error;
        }

        await connection.query(
            `UPDATE business SET active = true, registrationCode = NULL WHERE registrationCode = ?`,
            [registrationCode]
        );

        res.send({
            status: 'ok',
            message: 'Usuario activado',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = validateBusiness;
