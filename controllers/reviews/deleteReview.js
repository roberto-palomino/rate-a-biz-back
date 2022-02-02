const getDB = require('../../database/getDB');

const deleteReview = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos el id de la review que queremos borrar.
        const { idReview } = req.params;

        // Borramos el comentario.
        await connection.query(`DELETE FROM reviews WHERE id = ?`, [idReview]);

        res.send({
            status: 'ok',
            message: 'La review ha sido eliminada',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = deleteReview;
