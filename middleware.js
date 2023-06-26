const ExpressError = require("./utils/ExpressError");
const Student = require('./models/students')
const catchAsync = require('./utils/catchAsync')
const { subjectSchema, studentSchema, semSchema, resultSchema } = require('./schemas')

module.exports.isLoggedIn = (req, res, next) => {
    //checking whether user is logged in or not
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first!');
        req.session.returnTo = req.originalUrl
        return res.redirect('/users/login');
    }
    next();
}

module.exports.isAdmin = (req, res, next) => {
    //checking for admin
    if (req.user.isAdmin)
        return next()
    req.flash('error', 'You do not have permisssion')
    res.redirect('/')
}

module.exports.isAuthor = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const student = await Student.findById(id)
    //either admin or user linked to student can view 
    if (req.user.isAdmin || (student && student.user.equals(req.user._id)))
        return next()
    req.flash('error', 'You do not have permisssion')
    res.redirect('/')
})

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.findStudent = async (req, res) => {
    const { rollNo, subCode, grade } = req.body
    const student = await Student.findOne({ rollNo }).populate({
        path: 'results',
        populate: 'subject'
    })
    if (!student) {
        req.flash('error', `Student doesnot exist`)
        return res.redirect('/results/edit')
    }
    return { student, subCode, grade }
}

module.exports.validateSubject = (req, res, next) => {
    const { error } = subjectSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(' ')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

module.exports.validateStudent = (req, res, next) => {
    const { error } = studentSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(' ')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

module.exports.validateSem = (req, res, next) => {
    const { error } = semSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(' ')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

module.exports.validateResult = (req, res, next) => {
    const { error } = resultSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(' ')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}