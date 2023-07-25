import { Sequelize } from "sequelize";
import 'dotenv/dbConfig';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: 'localhost',
    port: '3306',
    dialect: 'mysql',
})

export default sequelize;