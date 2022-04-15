const getDB = require('../../database/getDB');

const editBusiness = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        /* Id de la empresa */
        const { idBusiness } = req.params;

        /* Campos del body que solicitamos*/
        const { name, description, url_web, linkedin, idSector } = req.body;

        /* Solicitamos la información de la empresa */
        const [business] = await connection.query(
            `SELECT id, name, description, url_web, linkedin, idUser, idSector, createdAt FROM business WHERE id = ?`,
            [idBusiness]
        );

        //Apartado para modificar el email: se comprueba que no esté en uso por otro usuario y
        // si ya exixte se lanza un mensaje de error:

        if (newEmail && newEmail !== users[0].email) {
            const [usersEmail] = await connection.query(
                `SELECT id FROM users WHERE email = ?`,
                [newEmail]
            );

            if (usersEmail.length > 0) {
                const error = new Error('Ya existe un usuario con ese email');
                error.httpStatus = 409;
                throw error;
            }

            // Se actualiza el usuario en la base de datos:
            await connection.query(
                `UPDATE users SET email = ?, modifiedAt = ? WHERE id = ?`,
                [newEmail, new Date(), idUser]
            );
        }

        // Modificación del username:

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

module.exports = editBusiness;
