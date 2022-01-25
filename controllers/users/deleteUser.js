const getDB = require('../../database/getDB');

const {
    deletePhoto,
    generateRandomString,
    getRandomNumber,
} = require('../../helpers');

const deleteUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idUser } = req.params;

        // Mensaje de error si el usuario es administrador con id=1
        /*   if (Number(idUser) === 1) {
            const error = new Error(
                'El administrador principal no puede ser eliminado'
            );
            error.httpStatus = 403;
            throw error;
        } */

        // Obtenemos el avatar del usuario y si lo tiene se borra:
        const [users] = await connection.query(
            `SELECT avatar FROM users WHERE id = ?`,
            [idUser]
        );
        if (users[0].avatar) {
            await deletePhoto(users[0].avatar);
        }

        // Anonimizamos el usuario.
        await connection.query(
            `
            UPDATE users
                SET password = ?, username = ?, email = ?, avatar = NULL, active = 0, deleted = 1, modifiedAt = ?
                WHERE id = ?
            `,
            [
                generateRandomString(20),
                `deleted ${getRandomNumber()}`,
                `deleted ${getRandomNumber()}`,
                new Date(),
                idUser,
            ]
        );

        res.send({
            status: 'ok',
            message: 'Usuario eliminado',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = deleteUser;
