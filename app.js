'use-strict';
const {courses} = require('./data')
const {Addcourse,getAllcourses,getAllUsers} = require('./model/queries')
const router = require('./route/api');
const cors = require('cors');
require('dotenv').config()

const start = require('./model/dbchecks');

const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/', router)

//check that all db is set before starting server

async function startApp(){

    try {
        let allset = await start();

        if(allset){
        app.listen(port,()=>{
            console.log(`App is listening on port ${port}`)
        })
       console.log(await getAllUsers())
        
       
       
        }else{
            console.error('Something wrong with db')
        }
        
    } catch (error) {
            console.error(error.message);
        
    }

    
}

startApp()
 