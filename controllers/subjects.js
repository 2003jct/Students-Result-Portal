const Subject = require('../models/subjects')
const catchAsync = require('../utils/catchAsync')
const Result = require('../models/results')

module.exports.showSubjects = catchAsync(async (req, res) => {
    const subjects = await Subject.find({})
    res.render('subjects/index', { subjects })
})

module.exports.renderNewForm = (req, res) => {
    res.render('subjects/new')
}

module.exports.showSubject = catchAsync(async (req, res) => {
    const { id } = req.params;
    const subject = await Subject.findById(id)
    res.render('subjects/show', { subject })
})

module.exports.renderEditForm = catchAsync(async (req, res) => {
    const { id } = req.params;
    const subject = await Subject.findById(id)
    res.render('subjects/edit', { subject })
})

module.exports.createSubject = catchAsync(async (req, res) => {
    const subject = new Subject(req.body.subject)
    await subject.save()
    req.flash('success', 'Subject is created successfully')
    res.redirect(`/subjects/${subject._id}`)
})

module.exports.editSubject = catchAsync(async (req, res) => {
    const { id } = req.params;
    await Subject.findByIdAndUpdate(id, { ...req.body.subject })
    res.redirect(`/subjects/${id}`)
})

module.exports.deleteSubject = catchAsync(async (req, res) => {
    const { id } = req.params
    const subject = await Subject.findById(id)
    const result = await Result.findOne({ subject })
    if (result)
        req.flash('error', 'Subject cannot be deleted as it is associated with result of student')
    else { 
        await Subject.findByIdAndDelete(id)
        req.flash('success', 'Subject deleted successfully')
    }
    res.redirect('/subjects')
})