const { cloudinary } = require('../cloudinary')
const Student = require('../models/students')
const catchAsync = require('../utils/catchAsync')

module.exports.showStudents = catchAsync(async (req, res) => {
    const students = await Student.find({})
    res.render('students/index', { students })
})

module.exports.renderNewForm = (req, res) => {
    res.render('students/register')
}

module.exports.viewStudent = catchAsync(async (req, res) => {
    const { id } = req.params
    const student = await Student.findById(id)
    res.render('students/show', { student })
})

module.exports.renderEditForm = catchAsync(async (req, res) => {
    const { id } = req.params
    const student = await Student.findById(id)
    res.render('students/edit', { student })
})

module.exports.createStudent = catchAsync(async (req, res) => {
    const student = new Student(req.body.student)
    student.image = req.files
    await student.save()
    res.redirect(`/students/${student._id}`)
})

module.exports.editStudent = catchAsync(async (req, res) => {
    const { id } = req.params
    const student = await Student.findByIdAndUpdate(id, { ...req.body.student })
    await student.save()
    res.redirect(`/students/${id}`)
})

module.exports.viewResults = catchAsync(async (req, res) => {
    const { id } = req.params
    const { semNo } = req.body
    let scredits = 0, tcredits = 0, sgpa = 0, cgpa = 0
    const student = await Student.findById(id).populate({
        path: 'results',
        populate: 'subject'
    })
    student.results = student.results.filter((result) => {
        if (result.subject.semNo <= semNo) {
            cgpa += result.subject.credits * result.grade
            tcredits += result.subject.credits
        }
        if (result.subject.semNo == semNo) {
            sgpa += result.subject.credits * result.grade
            scredits += result.subject.credits
        }
        return result.subject.semNo == semNo
    })
    sgpa = scredits > 0 ? sgpa / scredits : sgpa
    cgpa = tcredits > 0 ? cgpa / tcredits : cgpa
    if (student.results.length <= 0) {
        req.flash('error', `No result available cgpa till ${semNo}  semester is ${cgpa}`)
        return res.redirect(`/students/${id}`)
    }
    res.render('results/index', { student, semNo, sgpa, cgpa })

})

module.exports.renderImageForm = catchAsync(async (req, res) => {
    const { id } = req.params
    const student = await Student.findById(id)
    res.render('students/image', { student })
})

module.exports.editImage = catchAsync(async (req, res) => {
    const { id } = req.params
    const student = await Student.findById(id)
    if (student.image.filename) {
        await cloudinary.uploader.destroy(student.image.filename)
    }
    student.image = req.file
    await student.save()
    res.redirect(`/students/${id}`)
})

module.exports.deleteStudent = catchAsync(async (req, res) => {
    const { id } = req.params
    await Student.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted student')
    res.redirect('/students')
})
