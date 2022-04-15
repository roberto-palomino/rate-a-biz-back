const getDB = require('../../database/getDB');

const getBusiness = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        /* Obtenemos del body el número de empresas que se seleccionarán */
        const { numberBusiness } = req.body;

        /* Obtenemos todos los datos que me interesan de las empresas */
        const [topReviews] = await connection.query(
            `SELECT id, name, description, url_web, linkedin, idUser, idSector, createdAt FROM reviews LIMIT ?`,
            [numberBusiness]
        );

        const [business] = await connection.query(
            `SELECT id, name, description, url_web, linkedin, idUser, idSector, createdAt FROM business LIMIT ?`,
            [numberBusiness]
        );
        const [users] = await connection.query(
            `SELECT id, username, email, avatar, role, createdAt FROM users WHERE id = ?`,
            [business.idUser]
        );

        // Objeto con la información básica del usuario.
        const userInfo = {
            username: users[0].username,
            avatar: users[0].avatar,
        };

        // Si el usuario que realiza la request es el dueño de dicho usuario o si es
        // un administrador vamos a agregar información extra.
        if (users[0].id === idReqUser || req.userAuth.role === 'admin') {
            userInfo.email = users[0].email;
            userInfo.role = users[0].role;
            userInfo.createdAt = users[0].createdAt;
        }

        res.send({
            status: 'ok',
            data: {
                user: userInfo,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = getBusiness;
