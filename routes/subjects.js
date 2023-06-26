const express = require('express')
const router = express.Router()
const { isLoggedIn, isAdmin, validateSubject } = require('../middleware')
const subjectController = require('../controllers/subjects')

router.route('/')
    .get(subjectController.showSubjects)
    .post(isLoggedIn, isAdmin, validateSubject, subjectController.createSubject)

router.get('/new', isLoggedIn, isAdmin, subjectController.renderNewForm)

router.route('/:id')
    .get(subjectController.showSubject)
    .put(isLoggedIn, isAdmin, validateSubject, subjectController.editSubject)
    .delete(isLoggedIn, isAdmin, subjectController.deleteSubject)

router.get('/:id/edit', isLoggedIn, isAdmin, subjectController.renderEditForm)

module.exports = router