const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');

const { SENDGRID_API_KEY, SENDGRID_FROM } = process.env;

/* Asignamos la api Key a sendgrid */
sgMail.setApiKey(SENDGRID_API_KEY);

/* Generamos una cadena alfanumerica */

function generateRandomString(length) {
    return crypto.randomBytes(length).toString('hex');
}

/* Enviamos un email */

async function sendMail({ to, subject, body }) {
    try {
        /* preparamos el mensaje */
        const msg = {
            to,
            from: SENDGRID_FROM,
            subject,
            text: body,
            html: `
            <div>
                <h1>${subject}</h1>
                <p>${body}</p>
            </div> 
            `,
        };
        /* enviamos el mensaje */
        await sgMail.send(msg);
    } catch (error) {
        console.error(error);
        throw new Error('Hubo un error al enviar el mail');
    }
}

module.exports = { generateRandomString, sendMail };
