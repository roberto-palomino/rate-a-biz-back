const getDB = require('../../database/getDB');
const { PUBLIC_HOST } = process.env;
const { generateRandomString, sendMail } = require('../../helpers');

const recoverPassword = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos el email y el tipo de usuario
        const { email, userType } = req.body;

        // Si falta el email o el tipo de usuario lanzamos un error.
        if (!email || !userType) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        // Comprobamos si el email existe en la base de datos según el tipo de usuario.
        if (userType === 'business') {
            const [business] = await connection.query(
                `SELECT id FROM business WHERE email = ?`,
                [email]
            );

            // Si existe un usuario con ese email le enviamos un código de recuperación.
            if (business.length > 0) {
                // Generamos un código de recuperación.
                const recoverCode = generateRandomString(20);

                // Creamos el body del mnensaje.
                const emailBody = `
                Se solicitó un cambio de contraseña para el usuario registrado con este email en Rate a Biz.

                Pulsa este link para reestablecer la contraseña: ${PUBLIC_HOST}/${userType}/password/reset/${recoverCode}

                Si no has sido tú ignora este email.
            `;

                // Enviamos el email.
                await sendMail({
                    to: email,
                    subject: 'Cambio de contraseña en Rate a Biz',
                    body: emailBody,
                });

                // Agregamos el código de recuperación al usuario con dicho email.
                await connection.query(
                    `UPDATE business SET recoverCode = ?, modifiedAt = ? WHERE email = ?`,
                    [recoverCode, new Date(), email]
                );
            }
        } else {
            const [users] = await connection.query(
                `SELECT id FROM users WHERE email = ?`,
                [email]
            );

            if (users.length > 0) {
                const recoverCode = generateRandomString(20);
                const emailBody = `
                Se solicitó un cambio de contraseña para el usuario registrado con este email en Rate a Biz.

                Pulsa este link para reestablecer la contraseña: ${PUBLIC_HOST}/${userType}/password/reset/${recoverCode}

                Si no has sido tú ignora este email.
            `;
                await sendMail({
                    to: email,
                    subject: 'Cambio de contraseña en Rate a Biz',
                    body: emailBody,
                });

                await connection.query(
                    `UPDATE users SET recoverCode = ?, modifiedAt = ? WHERE email = ?`,
                    [recoverCode, new Date(), email]
                );
            }
        }

        res.send({
            status: 'ok',
            message:
                'Si el email existe se ha enviado un código de recuperación',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = recoverPassword;
