const express = require('express')
const router = express.Router()
const ExpressError = require('../utils/ExpressError')
const passport = require('passport')
const userController = require('../controllers/user')
const { storeReturnTo } = require('../middleware')

router.route('/register')
    .get(userController.renderRegisterForm)
    .post(userController.createUser)

router.route('/login')
    .get(userController.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }), userController.login)

router.get('/logout', userController.logout)

module.exports = router