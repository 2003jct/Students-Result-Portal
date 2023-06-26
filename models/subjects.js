const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subjectSchema = new Schema({
    credits: {
        type: Number,
        required: true
    },
    subName: {
        type: String,
        required: true
    },
    subCode: {
        type: String,
        unique: true,
        required: true
    },
    semNo: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Subject', subjectSchema)