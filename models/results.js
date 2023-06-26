const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const resultSchema = new Schema({
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject'
    },
    grade: Number
})

module.exports = mongoose.model('Result', resultSchema)