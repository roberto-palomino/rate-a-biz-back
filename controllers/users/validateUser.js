const getDB = require('../database/getDB');

const validateUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos el código de registro y comprobamos si existe algún usuario
        // pendiente de validar con ese código:
        const { registrationCode } = req.params;

        const [users] = await connection.query(
            `SELECT id FROM users WHERE registrationCode = ?`,
            [registrationCode]
        );

        // Si no hay usuarios pendientes de validar se envía un error:
        if (users.length < 1) {
            const error = new Error(
                'No hay usuarios pendientes de validar con ese código de registro'
            );
            error.httpStatus = 404;
            throw error;
        }

        // Se activa el usuario y se elimina el código de registro:
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
