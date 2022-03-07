const getDB = require('../../database/getDB');

const { savePhoto, deletePhoto } = require('../../helpers');

const editBusinessAvatar = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // ID del usuario a editar. Se comprueba que la propiedad req.files.avatar exista:
        const { idUser } = req.params;

        if (!(req.files && req.files.avatar)) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        // Se selecciona el avatar del usuario actual. Se comprueba si ya tiene uno y se así se elimina del servidor:
        const [users] = await connection.query(
            `SELECT avatar FROM users WHERE id = ?`,
            [idUser]
        );
        if (users[0].avatar) {
            await deletePhoto(users[0].avatar);
        }

        //   Se guarda el nuevo avatar en el servidor, se obtiene el nombre del mismo y se actualiza en el usuario:
        const avatarName = await savePhoto(req.files.avatar, 0);

        await connection.query(
            `UPDATE users SET avatar = ?, modifiedAt = ? WHERE id = ?`,
            [avatarName, new Date(), idUser]
        );
        res.send({
            status: 'ok',
            message: 'Usuario actualizado',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editBusinessAvatar;
