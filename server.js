require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const {
    login,
    signUp,
    validateUser,
    recoverPassword,
    resetUserPassword,
} = require('./controllers/commons');
const {
    getUser,
    editUser,
    editUserAvatar,
    editUserPass,
    deleteUser,
} = require('./controllers/users');

// Middlewares:
const { userIsAuth, userExists, canEditUser } = require('./middlewares/');

const app = express();
const { PORT } = process.env;

/* Middleware que nos da informacion acerca de las peticiones que entran en el servidor */
app.use(morgan('dev'));
/* Middleware que deserializa un body en formato "raw" */
app.use(express.json());
//Middleware que deserializa un body en formato "form-data" para trabajar con imágenes:
app.use(fileUpload());

/* Registramos un usuario */
app.post('/signup', signUp);

/* Validamos un usuario */
app.get('/validate/:registrationCode', validateUser);

/* Login de un usuario */
app.post('/login', login);

/* Enviar un código de recuperación al email de un registrado*/
app.put('/password/recover', recoverPassword);

/* Resetear contraseña de un usuario */
app.put('/password/reset/:recoverCode', resetUserPassword);

// Obtener información de un usuario.
app.get('/users/:idUser', userIsAuth, getUser);

// Editar el username y el email de un usuario.
app.put('/users/:idUser', userIsAuth, userExists, canEditUser, editUser);

// Editar el avatar de un usuario.
app.put(
    '/users/:idUser/avatar',
    userIsAuth,
    userExists,
    canEditUser,
    editUserAvatar
);

// Editar la contraseña de un usuario.
app.put(
    '/users/:idUser/password',
    userIsAuth,
    userExists,
    canEditUser,
    editUserPass
);

// Anonimizar un usuario sin borrarlo:
app.delete('/users/:idUser', userIsAuth, userExists, canEditUser, deleteUser);

/* Middleware de error */
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.httpStatus || 500).send({
        status: 'error',
        message: error.message,
    });
});

/* Middleware de no encontrado */
app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'Not found',
    });
});

/* ponemos al servidor a esscuchar un puerto */
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
