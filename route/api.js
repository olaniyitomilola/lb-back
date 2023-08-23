const express = require('express');
const { fetchAllCourses, fetchUserCourses, Authenticate, findUser, registerAccount, fetchUserDetails } = require('../controller/controller');
const { VerifyToken } = require('../services/TokenServices');


const router = express.Router();

router.route('/').get(VerifyToken,fetchUserDetails);
router.route('/courses').get(fetchAllCourses);
router.route('/courses/user').post(fetchUserCourses);
router.route('/user/login').post(Authenticate);
router.route('/user/register').post(registerAccount);

router.route('/user/register/:email').get(findUser);



module.exports = router;
