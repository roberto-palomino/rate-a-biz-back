const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const sharp = require('sharp');
const path = require('path');
const uuid = require('uuid');
const { ensureDir, unlink } = require('fs-extra');

const { SENDGRID_API_KEY, SENDGRID_FROM, UPLOADS_DIRECTORY } = process.env;

/* Asignamos la api Key a sendgrid */
sgMail.setApiKey(SENDGRID_API_KEY);

//Creamos la ruta absoluta al directorio de subida de archivos (imágenes u otros archivos: CV).
const uploadsDir = path.join(__dirname, UPLOADS_DIRECTORY);

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
                        <a href="https://imgbb.com/"><img src="https://i.ibb.co/cJP2SGB/logo-Grande.png" alt="logo-Grande" border="0"></a>
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

// Subir una foto al servidor:

async function savePhoto(image, type) {
    try {
        // Comprobamos que el directorio de subida de imágenes exista y si no existe lo crea:
        await ensureDir(uploadsDir);

        // Convertimos la imagen en un objeto "Sharp" para poder editarla:
        const sharpImage = sharp(image.data);

        // Accedemos a los metadatos de la imagen para posteriormente comprobar
        // el ancho total.
        const imageInfo = await sharpImage.metadata();

        // Si el tipo de imagen es 0 (avatar) redimensionamos la imagen a 150x150.
        if (type === 0) {
            sharpImage.resize(150, 150);
        }

        // Si la imagen es de tipo 2 (entrada) y el ancho supera el máximo indicado
        // redimensionamos la imagen.
        else if (type === 1 && imageInfo.width > 1000) {
            sharpImage.resize(1000);
        }

        // Generamos un nombre único para la imagen.
        const imageName = `${uuid.v4()}.jpg`;

        // Creamos la ruta absoluta a la ubicación donde queremos guardar la imagen.
        const imagePath = path.join(uploadsDir, imageName);

        // Guardamos la imagen en el directorio "uploads".
        await sharpImage.toFile(imagePath);

        // Retornamos el nombre de la imagen.
        return imageName;
    } catch (error) {
        console.error(error);
        throw new Error('Error al procesar la imagen');
    }
}

// Eliminar foto de avatar:

async function deletePhoto(photoName) {
    try {
        // Creamos la ruta absoluta a la foto.
        const photoPath = path.join(uploadsDir, photoName);

        // Eliminamos la foto del servidor.
        await unlink(photoPath);
    } catch (error) {
        console.error(error);
        throw new Error('Error al eliminar la imagen del servidor');
    }
}

/**
 * #####################
 * ## Validar esquema ##
 * #####################
 */
async function validate(schema, data) {
    try {
        await schema.validateAsync(data);
    } catch (error) {
        error.httpStatus = 400;
        throw error;
    }
}

module.exports = {
    generateRandomString,
    sendMail,
    savePhoto,
    deletePhoto,
    validate,
};
