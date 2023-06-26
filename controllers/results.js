const Subject = require("../models/subjects")
const catchAsync = require("../utils/catchAsync")
const Result = require('../models/results')
const { findStudent } = require('../middleware')

module.exports.renderForm = (url, heading) => catchAsync(async (req, res) => {
    res.render('results/new', { url, heading })
})

module.exports.editResults = catchAsync(async (req, res) => {
    const { student, subCode, grade } = await findStudent(req, res)
    for (let i = 0; i < 8; i++)
        if (subCode[i]) {
            if (!grade[i]) {
                req.flash('error', `Invalid grade for ${subCode[i]}, data for this subcode is not edited \n`)
            }
            else {
                let isReusultIncluded = false
                for (let result of student.results) {
                    if (result.subject.subCode === subCode[i]) {
                        isReusultIncluded = true;
                        await Result.findByIdAndUpdate(result._id, { grade: grade[i] })
                        break;
                    }
                }
                if (!isReusultIncluded) {
                    req.flash('error', ` ${subCode[i]} is not linked with student or invalid , data for this subcode is not edited \n `)
                }
            }
        }
    res.redirect('/results/edit')
})

module.exports.deleteResults = catchAsync(async (req, res) => {
    const { student, subCode } = await findStudent(req, res)
    const newResults = []
    for (let result of student.results) {
        let isResultNeeded = true;
        for (let sCode of subCode) {
            if (sCode && sCode === result.subject.subCode) {
                isResultNeeded = false
                await Result.findOneAndDelete(result._id)
                break
            }
        }
        if (isResultNeeded)
            newResults.push(result)
    }
    student.results = newResults
    await student.save()
    req.flash('success', `Deleted ${subCode} if they are valid \n`)
    res.redirect('/results/delete')
})

module.exports.addResults = catchAsync(async (req, res) => {
    const { student, subCode, grade } = await findStudent(req, res)
    for (let i = 0; i < 8; i++)
        if (subCode[i]) {
            if (!grade[i])
                return res.send(`Invalid grade ${subCode[i]}`)
            let isReusultIncluded = false
            for (let result of student.results) {
                if (result.subject.subCode === subCode[i]) {
                    isReusultIncluded = true;
                    req.flash('error', `Result is already included please use edit (subject : ${subCode[i]})`)
                    break
                }
            }
            if (!isReusultIncluded) {
                const subject = await Subject.findOne({ subCode: subCode[i] })
                if (!subject)
                    req.flash('error', `Invalid Subject code ${subCode[i]}`)
                else {
                    const result = new Result({ subject, grade: grade[i] })
                    await result.save()
                    student.results.push(result)
                }
            }

        }
    await student.save()
    res.redirect('/results/new')
})