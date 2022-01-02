const getDB = require('../../database/getDB');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const editUserPass = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Id del usuario que queremos editar.
        const { idUser } = req.params;

        // Obtenemos la contraseña vieja y la nueva.
        const { oldPassword, newPassword } = req.body;

        // Obtenemos el usuario con su contraseña.
        const [users] = await connection.query(
            `SELECT password FROM users WHERE id = ?`,
            [idUser]
        );

        // Guardamos en una variable el valor de la contraseña si es correcta o incorrecta. Si es incorrecta se manda mensaje de error.
        const isValid = await bcrypt.compare(oldPassword, users[0].password);

        if (!isValid) {
            const error = new Error('Contraseña incorrecta');
            error.httpStatus = 401;
            throw error;
        }

        // Hasheamos la nueva contraseña y actualizamos la base de datos.
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

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
