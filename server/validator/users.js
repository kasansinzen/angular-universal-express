const Joi = require('@hapi/joi')

const validation = (schema) => {
  return ((req, res, next) => {
    Joi.validate(req.body, schema, function (error, value) {
      if (error) return res.status(400).json({
        "status": 400,
        "message": error.details[0].message
      })
      if (!error) next()
    })
  })
}

const schema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().required()
})

module.exports = { validation, schema }