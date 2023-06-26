const Student = require('../models/students')
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')

module.exports.renderRegisterForm = (req, res) => {
    res.render('user/new')
}

module.exports.createUser = catchAsync(async (req, res) => {
    const { rollNo, username, password } = req.body
    const student = await Student.findOne({ rollNo })
    if (student) {
        if (student.user) {
            req.flash('error', 'Roll Number is already registered')
            return res.redirect('/users/register')
        }
        const user = new User({ username, isAdmin: false })
        const registeredUser = await User.register(user, password)
        student.user = registeredUser
        await student.save()
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome  ${student.name}`);
            res.redirect(`/students/${student._id}`)
        })
    }
    else {
        req.flash('error', 'Roll Number does not exist')
        res.redirect('/users/register')
    }
})

module.exports.login = catchAsync(async (req, res) => {
    if (req.user.isAdmin) {
        req.flash('success', 'Welcome Admin')
        const redirectUrl = res.locals.returnTo || '/portal/admin';
        res.redirect(redirectUrl);
    }
    else {
        const { user } = req
        const student = await Student.findOne({ user })
        if (!student) {
            req.flash('error', 'Invalid user ')
            return res.redirect('/users/login')
        }
        const redirectUrl = res.locals.returnTo || `/students/${student._id}`
        res.redirect(redirectUrl);
    }
})

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/users/login');
    });
}

module.exports.renderLoginForm = (req, res) => {
    res.render('user/login')
}