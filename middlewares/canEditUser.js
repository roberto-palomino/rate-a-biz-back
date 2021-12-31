const getDB = require('../controllers/database/getDB');

const canEditUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos el id del usuario que queremos editar.
        const { idUser } = req.params;

        // Lanzamos un error en caso de que ambos ids no coincidan.
        if (Number(idUser) !== req.userAuth.id) {
            const error = new Error('No tienes suficientes permisos');
            error.httpStatus = 403;
            throw error;
        }

        // Pasamos el control a la siguiente función.
        next();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = canEditUser;
