const BaseJoi = require('joi')
const sanitizeHTML = require('sanitize-html') //to remove html from input
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedTagsAttributes: {},
                })
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean
            }
        }
    }
})
const Joi = BaseJoi.extend(extension)

module.exports.subjectSchema = Joi.object({
    subject: Joi.object({
        credits: Joi.number().required(),
        subName: Joi.string().required().escapeHTML(),
        subCode: Joi.string().required().escapeHTML(),
        semNo: Joi.number().required().min(1).max(8)
    }).required()
})

module.exports.studentSchema = Joi.object({
    student: Joi.object({
        name: Joi.string().required().escapeHTML(),
        rollNo: Joi.string().required().escapeHTML(),
        fName: Joi.string().allow(null, '').escapeHTML(),
        phoneNo: Joi.number().allow(null, ''),
        dob: Joi.string().isoDate().escapeHTML().allow(null, '')
    }).required()
})

module.exports.semSchema = Joi.object({
    semNo: Joi.number().required().min(1).max(8)
}).required()

module.exports.resultSchema = Joi.object({
    rollNo: Joi.string().required().escapeHTML(),
    subCode: Joi.array().items(Joi.string().allow(null, '').escapeHTML()),
    grade: Joi.array().items(Joi.number().allow(null, '').min(0).max(10))
}).required()