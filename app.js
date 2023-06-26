if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const path = require('path') //path of this folder

const ejsMate = require('ejs-mate') //for making boiler plate 
const methodOverride = require('method-override') //for send put and delete request
const User = require('./models/user')

//session
const session = require('express-session')
const MongoStore = require('connect-mongo'); //to store session data in mongo
const mongoSanitize = require('express-mongo-sanitize') //to remove $gt: type 
const flash = require('connect-flash')  //for making flash messages

//for making user model passport is used so that password can protected  
const passport = require('passport')
const LocalStrategy = require('passport-local')

const ExpressError = require('./utils/ExpressError')

//importing routes
const studentsRoutes = require('./routes/students')
const resultsRoutes = require('./routes/results')
const subjectsRoutes = require('./routes/subjects')
const userRoutes = require('./routes/user')
const Student = require('./models/students')

const helmet = require('helmet')

//connecting to database
const dbUrl = process.env.dbUrl || 'mongodb://127.0.0.1:27017/student-results'
const mongoose = require('mongoose')
const { isLoggedIn, isAdmin } = require('./middleware')
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(dbUrl);
    console.log('Database Connected')
}

app.engine('ejs', ejsMate)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const secret = process.env.secret || '@!#'
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on('error', (e) => {
    console.log(e)
})

const sessionConfig = {
    store,
    name: 'Result Portal',
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure:true,  access over https only
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(mongoSanitize())
app.use(session(sessionConfig))
app.use(flash())

app.use(helmet()) //removes xss
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css'
];

const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'"],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/drqvusx5h/",
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user
    next()
})

app.use("/students", studentsRoutes)
app.use("/results", resultsRoutes)
app.use("/subjects", subjectsRoutes)
app.use("/users", userRoutes)

app.get('/', (req, res) => {
    res.render('home')
})
app.get('/portal/student', isLoggedIn, async (req, res) => {
    if (req.user.isAdmin)
        return res.redirect('/students')
    const student = await Student.findOne({ user: req.user })
    res.redirect(`/students/${student._id}`)
})
app.get('/portal/admin', isLoggedIn, isAdmin, (req, res) => {
    res.render('admin')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

//Error Handling route
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err
    if (!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on port ${port} `)
})

