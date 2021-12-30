const bcrypt = require('bcrypt');
const saltRounds = 10;
const getDB = require('../../../database/getDB');

const { generateRandomString, sendMail } = require('../../../helpers');
const { PUBLIC_HOST } = process.env;

const newUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos los campos necesarios del body.
        const { email, password } = req.body;

        // Generamos un código de registro de un solo uso.
        const registrationCode = generateRandomString(40);

        // Hasheamos la contraseña.
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Guardamos el usuario en la base de datos.
        await connection.query(
            `INSERT INTO users (email, password, registrationCode, createdAt) VALUES (?, ?, ?, ?)`,
            [email, hashedPassword, registrationCode, new Date()]
        );

        // Mensaje que enviaremos al correo del usuario.
        const emailBody = `
            Te acabas de registrar en Diario de Viajes.
            Pulsa este link para verificar tu cuenta: ${PUBLIC_HOST}/users/validate/${registrationCode}
        `;

        // Enviamos el email.
        await sendMail({
            to: email,
            subject: 'Activa tu usuario en Diario de Viajes',
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

module.exports = newUser;
