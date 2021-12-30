const getDB = require('../../../database/getDB');

const { deletePhoto, generateRandomString } = require('../../../helpers');

const deleteUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos el id del usuario que queremos borrar / anonimizar.
        const { idUser } = req.params;

        // Si el id del usuario que queremos eliminar es el administrador principal (id: 1)
        // lanzamos un error.
        if (Number(idUser) === 1) {
            const error = new Error(
                'El administrador principal no puede ser eliminado'
            );
            error.httpStatus = 403;
            throw error;
        }

        // Obtenemos el avatar del usuario.
        const [users] = await connection.query(
            `SELECT avatar FROM users WHERE id = ?`,
            [idUser]
        );

        // Si el usuario tiene un avatar lo borramos del servidor.
        if (users[0].avatar) {
            await deletePhoto(users[0].avatar);
        }

        // Anonimizamos el usuario.
        await connection.query(
            `
                UPDATE users
                SET password = ?, username = "[deleted]", email = "[deleted]", avatar = NULL, active = 0, deleted = 1, modifiedAt = ?
                WHERE id = ?
            `,
            [generateRandomString(20), new Date(), idUser]
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
