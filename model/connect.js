//connect database to the system


const Client = require('pg').Client;
require('dotenv').config();

//createdb on postgres first
const DB = new Client({
    user : 'postgres',
    host: 'localhost',
    password: "",
    port: 5400,
    
})

async function checkIfDbExist(DB){
    const query = `
    SELECT datname
    FROM pg_database
    WHERE datname = $1
    `;

    let res = await DB.query(query,['languagebuddy']);
    if(res.rowCount < 1){
        console.log('Language buddy  db does not exist, creating a new one')
        return false;
    } else{
        console.log('Language Buddy DB db started')
        return true;
    }
}
//create new db if it doesnt exists
async function createLB(DB){
    try{

        await DB.query('CREATE DATABASE languagebuddy');

        console.log('db created')

    }catch(err){console.error(err)}
}

//check if table exists, we are going to run this on all our tables

async function checkIfTableExists(table,DB){
    try{
        let query = `
        SELECT EXISTS(
            SELECT 1
            FROM information_schema.tables
            WHERE table_name = $1
        );
        `
        let res = await DB.query(query,[table]);
        if(res.rows[0].exists){
            console.log(`Table: ${table} exists`)
            return true
        }
        console.log(`Table: ${table} does not exist, create one`)
        return false;
    }catch(err){
        console.error(err)
    }
}
async function createUserTable(){
    const query = `
        CREATE TABLE IF NOT EXISTS users(
            id UUID PRIMARY KEY NOT NULL,
            first_name VARCHAR(255),
            last_name VARCHAR(255),
            password VARCHAR(255),
            level VARCHAR(255),
            language VARCHAR(255),
            email VARCHAR(255)
            
        );
    `;
    try{
        await DB.query(query);
        console.log('Table: Users created');

    }catch(err){
        console.error(`Error:`, err)
    }
    

}

async function alterCourseTable(){
    

    const alterQuery = `
    DROP TABLE courses
  `;

  try {
    await DB.query(alterQuery);
    console.log('Table "courses" deleted');
  } catch (error) {
    console.error('Error:', error);
  }

}




async function createCoursesTable(DB){
    const query = `
        CREATE TABLE IF NOT EXISTS courses(
            id UUID PRIMARY KEY NOT NULL,
            courseTitle VARCHAR(255),
            courseDescription VARCHAR(255),
            image_sources VARCHAR(255),
            course_level VARCHAR(255),
            course_language VARCHAR(255)

        );
    `;
    try{
        await DB.query(query);
        console.log('Table: Courses created');

    }catch(err){
        console.error(`Error:`, err)
    }
    

 }
// //this table relates the user and their orders
// async function createOrderTable(DB){
//     //SERIAL is Auto-Increment int in postgres
//      const query = `
//         CREATE TABLE IF NOT EXISTS orders(
//             id SERIAL PRIMARY KEY NOT NULL,
//             user_id UUID,
//             order_status VARCHAR(255),
//             total_price NUMERIC(10,2),
//             order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             FOREIGN KEY(user_id) REFERENCES users(id)
//         );
//     `;
//     try{
//         await DB.query(query);
//         console.log('Table: orders created');

//     }catch(err){
//         console.error(`Error:`, err)
//     }
    
// }

// //The table that relates the order with the products

// async function createOrderProductsTable(DB){
//     const query = `
//         CREATE TABLE IF NOT EXISTS order_products(
//             id SERIAL PRIMARY KEY NOT NULL,
//             order_id INT,
//             product_id INT,
//             quantity INT,
//             FOREIGN KEY(order_id) REFERENCES orders(id),
//             FOREIGN KEY(product_id) REFERENCES products(id)
//         );
//     `;
//     try{
//         await DB.query(query);
//         console.log('Table: order_products created');

//     }catch(err){
//         console.error(`Error:`, err)
//     }
    
// }

//remoeve event booking functionality for now

module.exports = {DB,checkIfDbExist,createLB,checkIfTableExists,createUserTable,createCoursesTable,alterCourseTable};