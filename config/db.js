
import  Sequelize  from "sequelize";
import dotenv from 'dotenv';

dotenv.config({path: '.env'})

const dbName = process.env.DB_NAME
const dbUser = process.env.DB_USER
const dbPswd = process.env.DB_PWD

const db = new Sequelize(
    dbName,
    dbUser,
    dbPswd ?? '',
    {
        host: 'localhost',
        port: 3306,
        dialect : 'mysql',
        define: {
            timestamps: true
        },
        pool : {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        operatorsAliases: false
    }
);

export default db;