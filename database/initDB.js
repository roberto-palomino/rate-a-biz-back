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
        await connection.query('DROP TABLE IF EXISTS salaries_range');

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
                headquarter VARCHAR(50),
                url_web VARCHAR(255),
                sector VARCHAR(75),
                linkedin VARCHAR(255),
                idUser INT NOT NULL,
                idSector INT NULL,
                FOREIGN KEY (idUser) REFERENCES users (id), 
                FOREIGN KEY (idSector) REFERENCES sectors (id),
                createdAt DATETIME NOT NULL,
                modifiedAt DATETIME
            )
`
        );
        await connection.query(
            `CREATE TABLE states (
                id INT PRIMARY KEY AUTO_INCREMENT,
                nameStates VARCHAR (50) NOT NULL,
                createdAt DATETIME NOT NULL,
                modifiedAt DATETIME
            )`
        );
        await connection.query(
            `CREATE TABLE business_states (
                id INT PRIMARY KEY AUTO_INCREMENT,
                idBusiness INT NOT NULL,
                idStates INT NOT NULL,
                FOREIGN KEY (idBusiness) REFERENCES business (id),
                FOREIGN KEY (idStates) REFERENCES states (id),
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
                salary_range VARCHAR (50) UNIQUE NOT NULL,
                createdAt DATETIME NOT NULL,
                modifiedAt DATETIME
            )`
        );
        await connection.query(
            `CREATE TABLE review (
                id INT PRIMARY KEY AUTO_INCREMENT,
                idBusiness INT NOT NULL,
                idBusiness_states INT NOT NULL,                
                idUser INT NOT NULL,
                idJobs INT NOT NULL,
                idSalaries INT NOT NULL,
                FOREIGN KEY (idBusiness_states) REFERENCES business_states (id),
                FOREIGN KEY (idUser) REFERENCES users (id),
                FOREIGN KEY (idJobs) REFERENCES jobs (id),
                FOREIGN KEY (idSalaries) REFERENCES salaries_range (id),
                start_year SMALLINT UNSIGNED NOT NULL,
                end_year SMALLINT UNSIGNED NULL,
                salary INT NOT NULL,
                enviroment INT NOT NULL,
                conciliation INT NOT NULL,
                oportunities INT NOT NULL,
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
                `INSERT INTO states (nameStates, createdAt) VALUES (?, ?)`,
                [state, new Date()]
            );
        }

        const sectors = [
            'Agricultura y ganadería',
            'Bienes de consumo',
            'Comercio electrónico',
            'Comercio y establecimientos',
            'Construcción',
            'Deporte y ocio',
            'Energía y medio ambiente',
            'Finanzas, seguros y bienes inmuebles ',
            'Internet',
            'Logística y transporte',
            'Medios de comunicación y marketing ',
            'Metalurgia y electrónica',
            'Productos químicos y materias primas ',
            'Salud e industria farmacéutica',
            'Servicios',
            'Tecnología y telecomunicaciones',
            'Turismo y hostelería',
            'Otros',
        ];
        for (const sector of sectors) {
            await connection.query(
                `INSERT INTO sectors (name, createdAt) VALUES (?, ?)`,
                [sector, new Date()]
            );
        }

        const salaries_range = [
            '< 15.000',
            '15.000 - 20.000',
            '20.000 - 25.000',
            '25.000 - 30.000',
            '30.000 - 35.000',
            '35.000 - 40.000',
            '40.000 - 45.000',
            '45.000 - 50.000',
            '50.000 - 60.000',
            '> 60.000',
        ];
        for (const salary_range of salaries_range) {
            await connection.query(
                `INSERT INTO salaries_range (salary_range, createdAt) VALUES (?, ?)`,
                [salary_range, new Date()]
            );
        }

        const jobs = [
            'Administrativo',
            'Operario',
            'Mozo de almacén',
            'Comercial',
            'Gerente',
            'CEO',
            'CFO',
            'Contable',
            'Camarero',
            'Cocinero',
            'Asistente ventas',
            'Conductor',
            'Seguridad',
            'RRHH',
            'Marketing',
            'Doctor',
            'Enfermero',
            'Gestor contenido',
            'Desarrollador',
            'Mantenimiento',
            'Abogado',
        ];
        for (const job of jobs) {
            await connection.query(
                `INSERT INTO jobs (name, createdAt) VALUES (?, ?)`,
                [job, new Date()]
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
