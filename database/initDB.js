const getDB = require('./getDB');

/* Creamos la función que creará las tablas de la base de datos */

async function initDB() {
    let connection;

    try {
        connection = await getDB();

        /* Eliminamos las tablas existentes para evitar conflictos */
        await connection.query('DROP TABLE IF EXISTS comments');
        await connection.query('DROP TABLE IF EXISTS votes');
        await connection.query('DROP TABLE IF EXISTS provincias');
        await connection.query('DROP TABLE IF EXISTS business');
        await connection.query('DROP TABLE IF EXISTS users');

        console.log('Tablas eliminadas');

        /* Creamos las tablas */
        await connection.query(`
            CREATE TABLE users (
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
                registrationCode VARCHAR(100),
                recoverCode VARCHAR(100),
                place VARCHAR(75),
                sector VARCHAR(50),
                createdAt DATETIME NOT NULL,
                modifiedAt DATETIME
            )
`
        );
        await connection.query(
            `CREATE TABLE votes (
                id INT PRIMARY KEY AUTO_INCREMENT,
                idBusiness INT NOT NULL,
                idUser INT NOT NULL,
                FOREIGN KEY (idBusiness) REFERENCES business (id) ON DELETE CASCADE,
                FOREIGN KEY (idUser) REFERENCES users (id) ON DELETE CASCADE,
                place VARCHAR(50),
                createdAt DATETIME NOT NULL,
                modifiedAt DATETIME,
                salary INT NOT NULL,
                enviroment INT NOT NULL,
                conciliation INT NOT NULL,
                oportunitys INT NOT NULL  
            )
 `
        );
        await connection.query(
            `CREATE TABLE comments (
                id INT PRIMARY KEY AUTO_INCREMENT,
                idBusiness INT NOT NULL,
                idUser INT NOT NULL,
                FOREIGN KEY (idBusiness) REFERENCES business (id) ON DELETE CASCADE,
                FOREIGN KEY (idUser) REFERENCES users (id) ON DELETE CASCADE,
                place VARCHAR(50),
                createdAt DATETIME NOT NULL,
                modifiedAt DATETIME,
                title VARCHAR (50) NOT NULL,
                body VARCHAR (500) NOT NULL 
            )
`
        );
        await connection.query(
            `CREATE TABLE provincias (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR (50) NOT NULL,
                createdAt DATETIME NOT NULL
            )`
        );
        await connection.query(
            `CREATE TABLE jobs (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR (50) NOT NULL,
                createdAt DATETIME NOT NULL
            )`
        );
        await connection.query(
            `CREATE TABLE Bjobs (
                id INT PRIMARY KEY AUTO_INCREMENT,
                idBusiness INT NOT NULL,
                idJobs INT NOT NULL,
                FOREIGN KEY (idBusiness) REFERENCES business (id) ON DELETE CASCADE,
                FOREIGN KEY (idJobs) REFERENCES jobs (id) ON DELETE CASCADE,
                createdAt DATETIME NOT NULL
            )`
        );

        await connection.query(
            `CREATE TABLE sectors (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR (50) NOT NULL,
                createdAt DATETIME NOT NULL
            )`
        );

        console.log('Tablas creadas');

        const provincias = [
            'A Coruña',
            'Álava',
            'Albacete',
            'Alicante',
            'Almería',
            'Asturias',
            'Ávila',
            'Badajoz',
            'Barcelona',
            'Burgos',
            'Cáceres',
            'Cádiz',
            'Cantabria',
            'Castellón',
            'Ciudad Real',
            'Córdoba',
            'Cuenca',
            'Girona',
            'Granada',
            'Guadalajara',
            'Guipúzcoa',
            'Huelva',
            'Huesca',
            'Islas Baleares',
            'Jaén',
            'León',
            'Lleida',
            'Lugo',
            'Madrid',
            'Málaga',
            'Murcia',
            'Navarra',
            'Ourense',
            'Palencia',
            'Pontevedra',
            'La Rioja',
            'Las Palmas',
            'Salamanca',
            'Segovia',
            'Sevilla',
            'Soria',
            'Tarragona',
            'Santa Cruz de Tenerife',
            'Teruel',
            'Toledo',
            'Valencia',
            'Valladolid',
            'Vizcaya',
            'Zamora',
            'Zaragoza',
        ];
        for (const provincia of provincias) {
            await connection.query(
                `INSERT INTO provincias (name, createdAt) VALUES (?, ?)`,
                [provincia, new Date()]
            );
        }
        const jobs = [];
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
