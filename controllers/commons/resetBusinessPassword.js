const getDb = require('../../database/getDB');
const bcrypt = require('bcrypt');

const resetBusinessPassword = async (req, res, next) => {
    let connection;

    try {
        connection = await getDb();

        const { recoverCode } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            const error = new Error('Faltan campos');
            error.Status = 400;
            throw error;
        }

        const [business] = await connection.query(
            `SELECT id FROM business WHERE recoverCode = ?`,
            [recoverCode]
        );

        if (business.length < 1) {
            const error = new Error('Codigo de recuperacion incorrecto');
            error.Status = 404;
            throw error;
        }

        const hasedPassword = await bcrypt.hash(newPassword, 10);

        await connection.query(
            `UPDATE business SET password = ?, recoverCode = NULL, modifiedAt = ? WHERE id = ?`,
            [hasedPassword, new Date(), business[0].id]
        );
        res.send({
            status: 'ok',
            message: 'Contraseña restablecida',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = resetBusinessPassword;
