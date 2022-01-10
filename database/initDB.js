const getDB = require('./getDB');

/* Creamos la función que creará las tablas de la base de datos */

async function initDB() {
    let connection;

    try {
        connection = await getDB();

        /* Eliminamos las tablas existentes para evitar conflictos */
        await connection.query('DROP TABLE IF EXISTS review');
        await connection.query('DROP TABLE IF EXISTS jobs');
        await connection.query('DROP TABLE IF EXISTS business_states');
        await connection.query('DROP TABLE IF EXISTS business');
        await connection.query('DROP TABLE IF EXISTS states');
        await connection.query('DROP TABLE IF EXISTS sectors');
        await connection.query('DROP TABLE IF EXISTS users');
        await connection.query('DROP TABLE IF EXISTS wages');

        console.log('Tablas eliminadas');

        /* Creamos las tablas */
        await connection.query(`
            CREATE TABLE users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                username VARCHAR(50) UNIQUE,
                avatar VARCHAR(50),
                name VARCHAR(50),
                lastname VARCHAR(50),
                active BOOLEAN DEFAULT false,
                deleted BOOLEAN DEFAULT false,
                role ENUM("admin", "worker", "business") DEFAULT "worker" NOT NULL,
                registrationCode VARCHAR(100),
                recoverCode VARCHAR(100),
                createdAt DATETIME NOT NULL,
                modifiedAt DATETIME
            )
`);
        await connection.query(
            `CREATE TABLE sectors (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR (50) UNIQUE NOT NULL,
                createdAt DATETIME NOT NULL,
                modifiedAt DATETIME
            )`
        );
        await connection.query(
            `CREATE TABLE business (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(75),
                description VARCHAR(250),
                url_web VARCHAR(255),
                linkedin VARCHAR(255),
                idUser INT NOT NULL,
                idSector INT NULL,
                FOREIGN KEY (idUser) REFERENCES users (id) ON DELETE CASCADE,
                FOREIGN KEY (idSector) REFERENCES sectors (id) ON DELETE CASCADE,
                createdAt DATETIME NOT NULL,
                modifiedAt DATETIME
            )
`
        );
        await connection.query(
            `CREATE TABLE states (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR (50) NOT NULL,
                createdAt DATETIME NOT NULL,
                modifiedAt DATETIME
            )`
        );
        await connection.query(
            `CREATE TABLE business_states (
                id INT PRIMARY KEY AUTO_INCREMENT,
                idBusiness INT NOT NULL,
                idStates INT NOT NULL,
                FOREIGN KEY (idBusiness) REFERENCES business (id) ON DELETE CASCADE,
                FOREIGN KEY (idStates) REFERENCES states (id) ON DELETE CASCADE,
                isHeadquartes BOOLEAN DEFAULT false,
                UNIQUE (idBusiness, idStates),
                createdAt DATETIME NOT NULL,
                modifiedAt DATETIME
            )`
        );
        await connection.query(
            `CREATE TABLE jobs (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR (50) UNIQUE NOT NULL,
                createdAt DATETIME NOT NULL,
                modifiedAt DATETIME
            )`
        );
        await connection.query(
            `CREATE TABLE salaries_range (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR (50) UNIQUE NOT NULL,
                createdAt DATETIME NOT NULL,
                modifiedAt DATETIME
            )`
        );
        await connection.query(
            `CREATE TABLE review (
                id INT PRIMARY KEY AUTO_INCREMENT,
                idBusiness INT NOT NULL,
                idUser INT NOT NULL,
                idJobs INT NOT NULL,
                idSalaries INT NOT NULL,
                FOREIGN KEY (idBusiness) REFERENCES business_states (id) ON DELETE CASCADE,
                FOREIGN KEY (idUser) REFERENCES users (id) ON DELETE CASCADE,
                FOREIGN KEY (idJobs) REFERENCES jobs (id) ON DELETE CASCADE,
                FOREIGN KEY (idSalaries) REFERENCES salaries_range (id) ON DELETE CASCADE,
                start_year SMALLINT UNSIGNED NOT NULL,
                end_year SMALLINT UNSIGNED NULL,
                salary CHAR(1) NOT NULL,
                enviroment CHAR(1) NOT NULL,
                conciliation CHAR(1) NOT NULL,
                oportunities CHAR(1) NOT NULL,
                title VARCHAR (50) NOT NULL,
                description VARCHAR (500) NOT NULL,  
                createdAt DATETIME NOT NULL,
                modifiedAt DATETIME
                )
 `
        );

        console.log('Tablas creadas');

        const states = [
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
        for (const state of states) {
            await connection.query(
                `INSERT INTO states (name, createdAt) VALUES (?, ?)`,
                [state, new Date()]
            );
        }
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
