const bcrypt = require('bcrypt');
const { generateRandomString, sendMail } = require('../../helpers');
const getDb = require('../../database/getDB');
const { PUBLIC_HOST } = process.env;

const signUp = async (req, res, next) => {
    let connection;

    try {
        connection = await getDb();

        /* Obtenemos los campos necesarios del body */
        const { email, password, role } = req.body;

        /* Si falta algun campo lanzamos un error */
        if (!email || !password || !role) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }
        /* Generamos un codigo de registro de un solo uso */
        const registrationCode = generateRandomString(40);
        /* Hasheamos la contraseña */
        const hashedPassword = await bcrypt.hash(password, 10);
        /* Guardamos el usuario en la base de datos según sea empresa o usuario*/
        if (role === 'business') {
            await connection.query(
                `INSERT INTO users (email, password, role, registrationCode, createdAt) VALUES (?,?,?,?,?)`,
                [email, hashedPassword, role, registrationCode, new Date()]
            );
            const [users] = await connection.query(
                `SELECT id FROM users WHERE email = ?`,
                [email]
            );
            await connection.query(
                `INSERT INTO business (idUser, createdAt) VALUES (?, ?)`,
                [users[0].id, new Date()]
            );
        } else {
            await connection.query(
                `INSERT INTO users (email, password, registrationCode, createdAt) VALUES (?,?,?,?)`,
                [email, hashedPassword, registrationCode, new Date()]
            );
        }

        /* Mensaje que enviaremos al correo del usuario */

        const emailBody = `
      Te acabas de registrar en Rate a Biz.
      Pulsa este link para verificar tu cuenta: ${PUBLIC_HOST}/validate/${registrationCode}
    `;
        /* Enviamos el mail */
        await sendMail({
            to: email,
            subject: 'Activa tu usuario en Rate a Biz!',
            body: emailBody,
        });

        res.send({
            status: 'ok',
            message: 'Usuario registrado, comprueba tu email para activarlo',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = signUp;
