const getDB = require('../../database/getDB');

const newVote = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();

        /* Obtenemos el id de la empresa que queremos votar */
        const { idBusiness } = req.params;
    } catch (error) {}
};
