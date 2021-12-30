require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const {
    login,
    signUp,
    validateUser,
    validateBusiness,
} = require('./controllers/commons');

const app = express();
const { PORT } = process.env;

/* Middleware que nos da informacion acerca de las peticiones que entran en el servidor */
app.use(morgan('dev'));

/* Middleware que deserializa un body en formato "raw" */
app.use(express.json());

/* Registramos un usuario */
app.post('/signup', signUp);

/* Validamos un usuario */
app.get('users/validate/:registrationCode', validateUser);

/* validamos una empresa */
app.get('business/validate/:registrationCode', validateBusiness);

/* Login de un usuario */
app.post('/login', login);

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
