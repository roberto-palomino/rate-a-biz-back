const getDB = require('../../database/getDB');
const { generateRandomString, sendMail } = require('../../helpers');
const bcrypt = require('bcrypt');
const { PUBLIC_HOST } = process.env;

const signUp = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();

        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        /* Generamos un codigo de un solo uso */
        const registrationCode = generateRandomString(40);

        /* Hasheamos la contraseña */
        const hashedPassword = await bcrypt.hash(password, 10);

        /* Guardamos el usuario en la base de datos según sea usuario o empresa */
        if (role === 'business') {
            console.log(connection.query);
            await connection.query(
                `INSERT INTO business (email, password, registrationCode, createdAt) VALUES (?,?,?,?)`,
                [email, hashedPassword, registrationCode, new Date()]
            );
        } else {
            await connection.query(
                `INSERT INTO users (email, password, registrationCode, createdAt) VALUES (?,?,?,?)`,
                [email, hashedPassword, registrationCode, new Date()]
            );
        }

        /* Creamos un mensaje para enviar por mail */
        const emailBody = `
         Te acabas de registrar en Rate a Biz.
      Pulsa este link para verificar tu cuenta: ${PUBLIC_HOST}/validate/${registrationCode}
        `;
        /* Enviamos el mail */
        await sendMail({
            to: email,
            subject: 'Activa tu usuario en Diario de viajes',
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
