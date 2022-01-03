const getDB = require('../database/getDB');

const canEditBusiness = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos el id de la empresa que queremos editar.
        const { idBusiness } = req.params;

        // Lanzamos un error en caso de que ambos ids no coincidan.
        if (Number(idBusiness) !== req.businessAuth.id) {
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

module.exports = canEditBusiness;
