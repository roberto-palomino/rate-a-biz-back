const getDB = require('../../../database/getDB');

const editUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos el id del usuario que queremos editar.
        const { idUser } = req.params;

        // Obtenemos los campos del body.
        const { username, newEmail } = req.body;

        // Si faltan los dos campos lanzamos un error.
        if (!username && !newEmail) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        // Obtenemos el email y el username del usuario.
        const [users] = await connection.query(
            `SELECT email, username FROM users WHERE id = ?`,
            [idUser]
        );

        //    Para modificar el email:

        if (newEmail && newEmail !== users[0].email) {
            // Comprobamos que el nuevo email no pertenezca a otro usuario.
            const [usersEmail] = await connection.query(
                `SELECT id FROM users WHERE email = ?`,
                [newEmail]
            );

            // Si el email ya existe lanzamos un error.
            if (usersEmail.length > 0) {
                const error = new Error('Ya existe un usuario con ese email');
                error.httpStatus = 409;
                throw error;
            }

            // Actualizamos el usuario en la base de datos.
            await connection.query(
                `UPDATE users SET email = ?, modifiedAt = ? WHERE id = ?`,
                [newEmail, new Date(), idUser]
            );
        }

        //    Para modificar el username:

        if (username && username !== users[0].username) {
            await connection.query(
                `UPDATE users SET username = ?, modifiedAt = ? WHERE id = ?`,
                [username, new Date(), idUser]
            );
        }

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

module.exports = editUser;
