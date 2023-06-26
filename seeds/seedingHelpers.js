const User = require('../models/user')
const Student = require('../models/students')
const Subject = require('../models/subjects')
const Result = require('../models/results')

module.exports.clearDataBase = async () => {
    await User.deleteMany({})
    await Result.deleteMany({})
    await Subject.deleteMany({})
    await Student.deleteMany({})
    console.log('Database is cleared')
}
module.exports.createAdmin = async () => {
    const username = process.env.adminUsername
    const password = process.env.adminPassword
    User.register(new User({ username, isAdmin: true }), password) //registering new admin user
    console.log('Admin created successfully')
}


module.exports.subjectSeeding = async () => {
    for (let i = 1; i <= 8; i++) {
        for (let j = 1; j <= 8; j++) {
            const subCode = `SUB${i}${j}`
            const subName = `NAME${i}${j}`
            const semNo = i
            const credits = Math.floor(Math.random() * 3) + 2
            const subject = new Subject({ subCode, subName, semNo, credits })
            await subject.save()
        }
    }
    console.log('Subjects created')
}
module.exports.usersSeeding = async () => {
    for (let i = 1; i <= 100; i++) {
        const username = `user${i}`
        const password = `password${i}`
        const user = await User.register(new User({ username, isAdmin: false }), password)
    }
    console.log('Users created')
}



module.exports.studentSeeding = async () => {
    for (let i = 1; i <= 100; i++) {
        const name = `NAME${i}`
        const rollNo = `ROLL${i}`
        const user = await User.findOne({ username: `user${i}` })
        const student = new Student({ name, rollNo, user })
        for (let j = 1; j <= 8; j++) {
            for (let k = 1; k <= 8; k++) {
                const subject = await Subject.findOne({ subCode: `SUB${j}${k}` })
                const result = new Result({ subject, grade: Math.floor(Math.random() * 7) + 4 })
                await result.save()
                student.results.push(result)
            }
        }
        await student.save()
    }
    console.log('Students created')
}