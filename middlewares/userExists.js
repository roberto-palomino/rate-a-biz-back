const getDB = require('../controllers/database/getDB');

const userExists = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos el id del usuario.
        const { idUser } = req.params;

        // Obtenemos el usuario.
        const [users] = await connection.query(
            `SELECT id FROM users WHERE id = ? AND deleted = false`,
            [idUser]
        );

        // Si el usuario no existe lanzamos un error.
        if (users.length < 1) {
            const error = new Error('El usuario no existe');
            error.httpStatus = 404;
            throw new error();
        }

        // Pasamos el control a la siguiente función.
        next();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = userExists;
