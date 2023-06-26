const express = require('express')
const router = express.Router()
const { isLoggedIn, isAdmin, isAuthor, validateStudent, validateSem } = require('../middleware')
const studentController = require('../controllers/students')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(isLoggedIn, isAdmin, studentController.showStudents)
    .post(isLoggedIn, isAdmin, upload.single('image'), validateStudent, studentController.createStudent)

router.get('/register', isLoggedIn, isAdmin, studentController.renderNewForm)

router.route('/:id')
    .get(isLoggedIn, isAuthor, studentController.viewStudent)
    .put(isLoggedIn, isAuthor, validateStudent, studentController.editStudent)
    .delete(isLoggedIn, isAdmin, studentController.deleteStudent)

router.route('/:id/image')
    .put(isLoggedIn, isAuthor, upload.single('image'), studentController.editImage)
    .delete(isLoggedIn, isAuthor, studentController.editImage)

router.get('/:id/edit', isLoggedIn, isAuthor, studentController.renderEditForm)

router.post('/:id/results', isLoggedIn, isAuthor, validateSem, studentController.viewResults)

router.get('/:id/edit/image', isLoggedIn, isAuthor, studentController.renderImageForm)

module.exports = router