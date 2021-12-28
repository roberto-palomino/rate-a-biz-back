const getDB = require('./getDB');

/* Creamos la función que creará las tablas de la base de datos */

async function initDB() {
    let connection;

    try {
        connection = await getDB();

        /* Eliminamos las tablas existentes para evitar conflictos */
        await connection.query('DROP TABLE IF EXISTS users');
        await connection.query('DROP TABLE IF EXISTS business');
        await connection.query('DROP TABLE IF EXISTS comments');
        await connection.query('DROP TABLE IF EXISTS votes');

        console.log('Tablas eliminadas');

        /* Creamos las tablas */
        await connection.query(`
            CREATE TABLE users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                username VARCHAR(50),
                avatar VARCHAR(50)
                active BOOLEAN DEFAULT false,
                deleted BOOLEAN DEFAULT false,
                role ENUM("admin", "normal") DEFAULT "normal" NOT NULL,
                registrationCode VARCHAR(100),
                recoverCode VARCHAR(100),
                createdAt DATETIME NOT NULL,
                modifiedAt DATETIME
            )
`);
        await connection.query(
            `CREATE TABLE business (
                id INT PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                username VARCHAR(50),
                avatar VARCHAR(50),
                active BOOLEAN DEFAULT false,
                deleted BOOLEAN DEFAULT false,
                role ENUM("admin", "normal") DEFAULT "normal" NOT NULL,
                registrationCode VARCHAR(100),
                recoverCode VARCHAR(100),
                createdAt DATETIME NOT NULL,
                modifiedAt DATETIME
            )
`
        );
        await connection.query(
            `CREATE TABLE votes (
                id INT PRIMARY KEY AUTO_INCREMENT,
                FOREIGN KEY (id) REFERENCES business (id) ON DELETE CASCADE,
                FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE,
                createdAt DATETIME NOT NULL,
                modifiedAt DATETIME,
                salary INT,
                enviroment INT,
                carreer INT,
                oportunitys INT  
            )
 `
        );
        await connection.query(
            `CREATE TABLE comments (
                id INT PRIMARY KEY AUTO_INCREMENT,
                FOREIGN KEY (id) REFERENCES business (id) ON DELETE CASCADE,
                FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE,
                createdAt DATETIME NOT NULL,
                modifiedAt DATETIME,
                title VARCHAR (50) NOT NULL,
                body VARCHAR (500) NOT NULL 
            )
`
        );

        console.log('Tablas creadas');
    } catch (err) {
        console.error(err);
    } finally {
        /* Liberamos la conexión */
        if (connection) connection.release();

        /* Se cierra el proceso actual */
        process.exit();
    }
}

initDB();
