const express = require('express');
const router = express.Router();
const {body} = require('express-validator');  //to validate the user input as a middleware
const {register,login,getProfile,logout} = require('../controllers/user.controller'); 
const {authUser} = require('../middlewares/auth.middleware');

router.post('/register',[
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('fullname.firstname').isLength({min:3}).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long')
],register)

router.post('/login',[
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long')
],login)

router.get('/profile',authUser,getProfile)

router.get('/logout',logout)

module.exports = router;