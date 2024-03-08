import 'dotenv/config';
import mysql from 'mysql2/promise';

export default mysql.createPool({
    user: process.env.DB_USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    connectionLimit: 10
})



