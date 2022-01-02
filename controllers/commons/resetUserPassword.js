const getDb = require('../../database/getDB');
const bcrypt = require('bcrypt');

const resetUserPassword = async (req, res, next) => {
    let connection;

    try {
        connection = await getDb();
        /* Obtener codigo de recuperacion y nueva pass */
        const { recoverCode } = req.params;
        const { newPassword } = req.body;

        /* si falta la contraseña*/
        if (!newPassword) {
            const error = new Error('Faltan campos');
            error.Status = 400;
            throw error;
        }
        /* Obtenemos el usuario con ese codigo */
        const [users] = await connection.query(
            `SELECT id FROM users WHERE recoverCode = ?`,
            [recoverCode]
        );
        /* Comprobar el codigo */
        if (users.length < 1) {
            const error = new Error('Codigo de recuperacion incorrecto');
            error.Status = 404;
            throw error;
        }

        /* New pass */
        const hasedPassword = await bcrypt.hash(newPassword, 10);

        /* Actualizar la pass */
        await connection.query(
            `UPDATE users SET password = ?, recoverCode = NULL, modifiedAt = ? WHERE id = ?`,
            [hasedPassword, new Date(), users[0].id]
        );
        res.send({
            status: 'ok',
            message: 'Contraseña restablecida',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = resetUserPassword;
