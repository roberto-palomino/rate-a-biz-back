const getDb = require('../../database/getDB');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
    let connection;
    try {
        connection = await getDb();

        const { email, password, userType } = req.body;

        if (!email || !password || !userType) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }
        /* Variable para almecenar el booleno: Contraseña correcta o incorrecta */
        let validPassword;

        /* Comprobamos si existe un usuario o empresa con ese email */
        if (userType === 'business') {
            const [business] = await connection.query(
                `SELECT id, password, active FROM business WHERE email = ?`,
                [email]
            );

            /* Si la query nos devolvió un usuario, comprobamos la contraseña */
            if (business.length > 0) {
                validPassword = await bcrypt.compare(
                    password,
                    business[0].password
                );
            }

            /* Si no hay usuario, o la contraseña es incorrecta lanzamos un error */
            if (business.length < 1 || !validPassword) {
                const error = new Error('Email o contraseña incorrectos');
                error.httpStatus = 401;
                throw error;
            }

            /* Si el usuario está pendiente de activar, lanzamos un error */
            if (!business[0].active) {
                const error = new Error(
                    'Usuario pendiente de activar, por favor revise su email'
                );
                error.httpStatus = 401;
                throw error;
            }

            /* Creamos un objeto con la información que le vamos a dar al token */
            const tokenInfo = {
                id: business[0].id,
                userType: business[0].userType,
            };

            /* Creamos el token */
            const token = jwt.sign(tokenInfo, process.env.SECRET, {
                expiresIn: '10d',
            });

            res.send({
                status: 'ok',
                data: {
                    token,
                },
            });
        } else {
            /* Si es un usuario */
            const [users] = await connection.query(
                `SELECT id, role, password, active FROM users WHERE email = ?`,
                [email]
            );
            if (users.length > 0) {
                validPassword = await bcrypt.compare(
                    password,
                    users[0].password
                );
            }

            if (users.length < 1 || !validPassword) {
                const error = new Error('Email o contraseña incorrectos');
                error.httpStatus = 401;
                throw error;
            }

            if (!users[0].active) {
                const error = new Error(
                    'Usuario pendiente de activar, por favor revise su email'
                );
                error.httpStatus = 401;
                throw error;
            }

            const tokenInfo = {
                id: users[0].id,
                userType: users[0].userType,
            };

            const token = jwt.sign(tokenInfo, process.env.SECRET, {
                expiresIn: '10d',
            });

            res.send({
                status: 'ok',
                data: {
                    token,
                },
            });
        }
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};
module.exports = login;
