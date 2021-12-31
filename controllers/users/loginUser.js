const getDB = require('../database/getDB');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos el email y la contraseña.
        const { email, password } = req.body;

        // Si falta algún campo lanzamos un error.
        if (!email || !password) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        // Comprobamos si existe un usuario con ese email.
        const [users] = await connection.query(
            `SELECT id, role, password, active FROM users WHERE email = ?`,
            [email]
        );

        // Variable que almacenará un valor booleano: contraseña correcta o incorrecta.
        let validPassword;

        // En caso de que exista un usuario con el email establecido en el body comprobamos
        // si la contraseña es correcta.
        if (users.length > 0) {
            validPassword = await bcrypt.compare(password, users[0].password);
        }

        // Si la contraseña no es correcta lanzamos un error.
        if (users.length < 1 || !validPassword) {
            const error = new Error('Email o contraseña incorrecta');
            error.httpStatus = 401;
            throw error;
        }

        // Si el usuario existe pero no está activo lanzamos un error.
        if (!users[0].active) {
            const error = new Error('Usuario pendiente de activar');
            error.httpStatus = 401;
            throw error;
        }

        // Objeto con la información que le vamos a pasar al token.
        const tokenInfo = {
            id: users[0].id,
            role: users[0].role,
        };

        // Creamos el token.
        const token = jwt.sign(tokenInfo, process.env.SECRET, {
            expiresIn: '10d',
        });

        res.send({
            status: 'ok',
            data: {
                token,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = loginUser;
