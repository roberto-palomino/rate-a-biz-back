const getDB = require('../../database/getDB');

const validateUser = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();

        /* obtenemos el codigo de registro */
        const { registrationCode } = req.params;

        /* Comprobamos si existe un usuario pendiente de validar con ese codigo */
        const [users] = await connection.query(
            `SELECT id FROM users WHERE registrationCode = ?`,
            [registrationCode]
        );

        /* Si no hay usuarios pendientes con ese codigo lanzamos un error */
        if (users.length < 1) {
            const error = new Error(
                'No hay nigun usuario pendiente de validar con ese codigo'
            );
            error.httpStatus = 404;
            throw error;
        }
        /* Activamos el usuario y borramos el codigo de registro */
        await connection.query(
            `UPDATE users SET active = true, registrationCode = NULL WHERE registrationCode = ?`,
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

module.exports = validateUser;
