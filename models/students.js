const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const User = require('./user')
const Result = require('./results')

const StudentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    rollNo: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        path: String,
        filename: String
    },
    fName: String,
    phoneNo: Number,
    dob: Date,
    results: [{
        type: Schema.Types.ObjectId,
        ref: 'Result',
        unique: true
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    }
})

StudentSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await User.deleteOne({ _id: doc.user })
        await Result.deleteMany({
            _id: {
                $in: doc.results
            }
        })
    }
})


module.exports = mongoose.model('Student', StudentSchema)