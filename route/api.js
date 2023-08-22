const express = require('express');
const { fetchAllCourses, fetchUserCourses, signIn, findUser, registerAccount } = require('../controller/controller');


const router = express.Router();


router.route('/courses').get(fetchAllCourses);
router.route('/courses/user').post(fetchUserCourses);
router.route('/user/login').post(signIn);
router.route('/user/register').post(registerAccount);

router.route('/user/register/:email').get(findUser);



module.exports = router;
