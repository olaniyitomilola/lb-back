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

async function checkIfDbExist(DB,dbname){
    const query = `
    SELECT datname
    FROM pg_database
    WHERE datname = $1
    `;

    let res = await DB.query(query,[dbname]);
    if(res.rowCount < 1){
        console.log('Language buddy  db does not exist, creating a new one')
        return false;
    } else{
        console.log('Language Buddy DB db started')
        return true;
    }
}
//create new db if it doesnt exists
async function createLB(DB, dbName) {
  try {
    await DB.query(`CREATE DATABASE ${dbName}`);
    console.log(`Database '${dbName}' created`);
  } catch (err) {
    console.error(err);
  }
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


async function dropTable(name){
    const alterQuery = `
    DROP TABLE courseassessment
  `;

  try {
    await DB.query(alterQuery);
    console.log(`Table ${name} deleted`);
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
//this table relates the course table using the courseID as foreign key
async function createCourseAssessments(DB){
    //SERIAL is Auto-Increment int in postgres
     const query = `
        CREATE TABLE IF NOT EXISTS courseassessment(
            id SERIAL PRIMARY KEY NOT NULL,
            course_id UUID,
            option_a VARCHAR(255),
            option_b VARCHAR(255),
            option_c VARCHAR(255),
            option_d VARCHAR(255),
            correct_answer VARCHAR(255),
            question VARCHAR(255),
            dateAdded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(course_id) REFERENCES courses(id)
        );
    `;
    try{
        await DB.query(query);
        console.log('Table: courseAssessment Table created');

    }catch(err){
        console.error(`Error:`, err)
    }
    
}

async function createCourseAssessmentUser(DB){
    //SERIAL is Auto-Increment int in postgres
     const query = `
        CREATE TABLE IF NOT EXISTS course_assessment_user(
            id SERIAL PRIMARY KEY NOT NULL,
            user_id UUID,
            courseassessment_id INT,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(courseassessment_id) REFERENCES courseassessment(id)


        );
    `;
    try{
        await DB.query(query);
        console.log('Table: courseAssessment_user Table created');

    }catch(err){
        console.error(`Error:`, err)
    }
    
}


module.exports = {DB, createCourseAssessmentUser, dropTable, checkIfDbExist,createLB,checkIfTableExists,createUserTable,createCoursesTable,alterCourseTable,createCourseAssessments};