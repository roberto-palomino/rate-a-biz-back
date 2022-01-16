const getDB = require('../../database/getDB');

const editReview = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos el id de la review que queremos editar.
        const { idReview } = req.params;

        // Obtenemos las propiedades del body.
        let { title, description } = req.body;

        // Si no recibimos una de las dos propiedades lanzamos un error.
        if (!title && !description) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        // Obtenemos el comentario.
        const [reviews] = await connection.query(
            `SELECT title, body FROM comments WHERE id = ?`,
            [idReview]
        );

        // Si recibimos un valor en "title" o "body" nos quedamos con ese valor (el
        // que venga del body). En caso contrario nos quedamos con el valor que hubiese en
        // la base de datos.
        title = title || reviews[0].title;
        description = description || reviews[0].description;

        // Actualizamos el comentario.
        await connection.query(
            `UPDATE reviews SET title = ?, body = ?, modifiedAt = ? WHERE id = ?`,
            [title, description, new Date(), idReview]
        );

        res.send({
            status: 'ok',
            message: 'Comentario actualizado',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editReview;
