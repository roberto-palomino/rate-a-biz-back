const getDB = require('../database/getDB');

const jwt = require('jsonwebtoken');

const userIsAuth = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos la cabecera de autorización (el token).
        const { authorization } = req.headers;

        // Si no hay cabecera de autorización lanzamos un error.
        if (!authorization) {
            const error = new Error('Falta la cabecera de autorización');
            error.httpStatus = 401;
            throw error;
        }

        // Variable que almacenará la información del token: el id y el rol.
        let tokenInfo;

        try {
            // Desencriptamos el token.
            tokenInfo = jwt.verify(authorization, process.env.SECRET);
        } catch (_) {
            const error = new Error('El token no es válido');
            error.httpStatus = 401;
            throw error;
        }

        // Seleccionamos el usuario con el id que viene en el token.
        const [users] = await connection.query(
            `SELECT active, deleted FROM users WHERE id = ?`,
            [tokenInfo.id]
        );

        // Si el usuario no está activado o si está eliminado lanzamos un error.
        if (!users[0].active || users[0].deleted) {
            const error = new Error('El token no es válido');
            error.httpStatus = 401;
            throw error;
        }

        // Inyectamos en el objeto "request" la info del token: id, role.
        req.userAuth = tokenInfo;

        // Pasamos el control a la siguiente función.
        next();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = userIsAuth;
