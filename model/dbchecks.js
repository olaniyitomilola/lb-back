const { DatabaseError } = require('pg');
const {DB,checkIfDbExist, createLB,checkIfTableExists,createUserTable,createCoursesTable, createCourseAssessments} = require('./connect');


async function start(){
    try{
        await DB.connect();
        //check skimpy db
        let res = await checkIfDbExist(DB);
        


        if(!res){
            await createLB(DB);
            //create the tables too
            //create user table
            await createUserTable(DB);
        }else{

            //db exists, check tables
            //check users table
            let userCheck = await checkIfTableExists('users',DB)
            //if User table does not exist, create one
            if(!userCheck){
                await createUserTable(DB);
            }
            //check courses table
            let coursesCheck = await checkIfTableExists('courses', DB)

            if(!coursesCheck){
                await createCoursesTable(DB)
                //create product table
            }

            let courseAssessmentCheck = await checkIfTableExists('courseassessment', DB)

            if(!courseAssessmentCheck){
                await createCourseAssessments(DB)
                //create product table
            }
            // //check orders table

            // let ordersCheck = await checkIfTableExists('orders',DB)

            // if(!ordersCheck){
            //     await createOrderTable(DB);
            // }
            // let orderProductsCheck = await checkIfTableExists('order_products',DB);
            // if(!orderProductsCheck){
            //     await createOrderProductsTable(DB)
            // }

        }
       
        return true;

    }catch(error){
        throw new DatabaseError("Unable to Start DB");
    }
}

module.exports = start;