const express = require('express')
const router = express.Router()
const { isLoggedIn, isAdmin, validateResult } = require('../middleware')
const resultController = require('../controllers/results')

router.route('/')
    .put(isLoggedIn, isAdmin, validateResult, resultController.editResults)
    .delete(isLoggedIn, isAdmin, validateResult, resultController.deleteResults)
    .post(isLoggedIn, isAdmin, validateResult, resultController.addResults)

router.get('/new', isLoggedIn, isAdmin, resultController.renderForm('/results', 'New '))

router.get('/edit', isLoggedIn, isAdmin, resultController.renderForm('/results?_method=PUT', 'Edit '))

router.get('/delete', isLoggedIn, isAdmin, resultController.renderForm('/results?_method=DELETE', 'Delete '))

module.exports = router