require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const signUp = require('./controllers/commons');

const app = express();
const { PORT } = process.env;

// Middlewares:

const { isAuth, userExists, canEditUser } = require('./middlewares/');

// Controladores Usuarios:

const {
    newUser,
    validateUser,
    loginUser,
    getUser,
    editUser,
    editUserAvatar,
    editUserPass,
    deleteUser,
} = require('./controllers/commons/users');

/* Middleware que nos da informacion acerca de las peticiones que entran en el servidor */
app.use(morgan('dev'));

/* Middleware que deserializa un body en formato "raw" */
app.use(express.json());
//Middleware que deserializa un body en formato "form-data" para trabajar con imágenes:
app.use(fileUpload());
// Crear un usario:
app.post('/users', newUser);
// Validar un usuario.
app.get('/users/validate/:registrationCode', validateUser);
// Logueamos un usario:
app.post('/users/login', loginUser);
/* Registramos un usuario */
app.post('/signup', signUp);
// Obtener información de un usuario.
app.get('/users/:idUser', isAuth, getUser);
// Editar el username y el email de un usuario.
app.put('/users/:idUser', isAuth, userExists, canEditUser, editUser);
// Editar el avatar de un usuario.
app.put(
    '/users/:idUser/avatar',
    isAuth,
    userExists,
    canEditUser,
    editUserAvatar
);
// Editar la contraseña de un usuario.
app.put(
    '/users/:idUser/password',
    isAuth,
    userExists,
    canEditUser,
    editUserPass
);

// Anonimizar un usuario sin borrarlo:
app.delete('/users/:idUser', isAuth, userExists, canEditUser, deleteUser);

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
