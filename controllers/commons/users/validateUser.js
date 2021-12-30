const getDB = require('../../../database/getDB');

const validateUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos el código de registro.
        const { registrationCode } = req.params;

        // Comprobamos si existe algún usuario pendiente de validar con el código anterior.
        const [users] = await connection.query(
            `SELECT id FROM users WHERE registrationCode = ?`,
            [registrationCode]
        );

        // Si no hay usuarios pendientes de validar con ese código de registro lanzamos un
        // error.
        if (users.length < 1) {
            const error = new Error(
                'No hay usuarios pendientes de validar con ese código de registro'
            );
            error.httpStatus = 404;
            throw error;
        }

        // Activamos el usuario y eliminamos el código de registro.
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
