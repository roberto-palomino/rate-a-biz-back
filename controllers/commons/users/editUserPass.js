const getDB = require('../../../database/getDB');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const editUserPass = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos el id del usuario que queremos editar.
        const { idUser } = req.params;

        // Obtenemos la contraseña vieja y la nueva.
        const { oldPassword, newPassword } = req.body;

        // Obtenemos el usuario con su contraseña.
        const [users] = await connection.query(
            `SELECT password FROM users WHERE id = ?`,
            [idUser]
        );

        // Guardamos en una variable un valoor booleano: contraseña correcta o incorrecta.
        const isValid = await bcrypt.compare(oldPassword, users[0].password);

        // Si la contraseña es incorrecta lanzamos un error.
        if (!isValid) {
            const error = new Error('Contraseña incorrecta');
            error.httpStatus = 401;
            throw error;
        }

        // Hasheamos la nueva contraseña.
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Actualizamos la base de datos.
        await connection.query(
            `UPDATE users SET password = ?, modifiedAt = ? WHERE id = ?`,
            [hashedPassword, new Date(), idUser]
        );

        res.send({
            status: 'ok',
            message: 'Contraseña actualizada',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editUserPass;
