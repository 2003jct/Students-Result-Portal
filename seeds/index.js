if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const mongoose = require('mongoose')
const dbUrl = process.env.dbUrl || 'mongodb://127.0.0.1:27017/student-results'
const { createAdmin, clearDataBase, subjectSeeding, usersSeeding, studentSeeding } = require('./seedingHelpers')

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(dbUrl);
    console.log('Database Connected')
    await clearDataBase()
    await createAdmin()
    await subjectSeeding()
    await usersSeeding()
    await studentSeeding()
    console.log('Seeding completed')
    mongoose.connection.close()
}



