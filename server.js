require('dotenv').config();

const express = require('express');
const cors = require('cors');
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
    getBusiness,
    editUser,
    editBusiness,
    editUserAvatar,
    editBusinessAvatar,
    editUserPass,
    deleteUser,
} = require('./controllers/users');
const {
    getStates,
    getJobs,
    getSectors,
    getSalaries,
} = require('./controllers/tables');
const { newReview } = require('./controllers/reviews');
const { searchBusiness, getTopBusiness } = require('./controllers/business');

// Middlewares:
const { userIsAuth, userExists, canEditUser } = require('./middlewares/');

const app = express();
const { PORT } = process.env;
/* Middleware CORS */
app.use(cors());

/* Middleware que nos da informacion acerca de las peticiones que entran en el servidor */
app.use(morgan('dev'));
/* Middleware que deserializa un body en formato "raw" */
app.use(express.json());
//Middleware que deserializa un body en formato "form-data" para trabajar con imágenes:
app.use(fileUpload());

/* ##########################
   ###### COMMONS  ##########
   ##########################*/

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

/* ##########################
   ######## USERS  ##########
   ##########################*/

// Obtener información de un usuario.
app.get('/users/:idUser', userIsAuth, getUser);

// Editar el username, el email, el nombre y el apellido de un usuario.
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

// Obtener información de una empresa.
app.get('/business/:idUser', userIsAuth, getBusiness);

// Editar el name, url_web de una empresa.
app.put('/business/:idUser', userIsAuth, userExists, canEditUser, editBusiness);

// Editar el avatar de una empresa.
app.put(
    '/business/:idUser/avatar',
    userIsAuth,
    userExists,
    canEditUser,
    editBusinessAvatar
);

/* ##########################
   ####### REVIEWS ###########
   ##########################*/

/* Crear una nueva review */
app.post('/review/:idBusiness', userIsAuth, newReview);

/* ##########################
####### Bussines #########
##########################*/

app.get('/business', searchBusiness);

app.get('/getTopBusiness', getTopBusiness);
/* ##########################
   ####### TABLAS ###########
   ##########################*/

/* Obtener los nombres de las provincias */
app.get('/states', getStates);

/* Obtener los nombres de los trabajos */
app.get('/jobs', getJobs);

/* Obtener los nombres de los sectores */
app.get('/sectors', getSectors);

/* Obtener los rangos salariales*/
app.get('/salaries', getSalaries);

/* ##########################
   ###### MIDDLEWARES  ######
   ##########################*/

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
