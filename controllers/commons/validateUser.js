const getDB = require('../../database/getDB');

const validateUser = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();

        /* obtenemos el codigo de registro */
        const { registrationCode } = req.params;
        const { role } = req.body;

        /* Comprobamos que venga el rol */
        if (!role) {
            const error = new Error('Faltan campos');
            error.httpStatus = 403;
            throw error;
        }

        /* Comprobamos si existe un usuario o empresa pendiente de validar con ese codigo */
        if (role === 'business') {
            const [business] = await connection.query(
                `SELECT id FROM business WHERE registrationCode = ?`,
                [registrationCode]
            );

            /* Si no hay empresas pendientes con ese codigo lanzamos un error */
            if (business.length < 1) {
                const error = new Error(
                    'No hay nigun usuario pendiente de validar con ese codigo'
                );
                error.httpStatus = 404;
                throw error;
            }
            /* Activamos la empresa y borramos el codigo de registro */
            await connection.query(
                `UPDATE business SET active = true, registrationCode = NULL WHERE registrationCode = ?`,
                [registrationCode]
            );
        } else {
            const [users] = await connection.query(
                `SELECT id FROM users WHERE registrationCode = ?`,
                [registrationCode]
            );

            if (users.length < 1) {
                const error = new Error(
                    'No hay nigun usuario pendiente de validar con ese codigo'
                );
                error.httpStatus = 404;
                throw error;
            }

            await connection.query(
                `UPDATE users SET active = true, registrationCode = NULL WHERE registrationCode = ?`,
                [registrationCode]
            );
        }
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
