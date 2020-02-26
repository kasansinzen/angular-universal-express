const Joi = require('@hapi/joi')

const validation = (schema) => {
  return ((req, res, next) => {
    // console.log("req", req.body)
    Joi.validate(req.body, schema, function (error, value) {
      // console.log("I'm here")
      if (error) return res.status(400).json({
        "status": 400,
        "message": error.details[0].message
      });
      if (!error) next();
    });
  });
}

const schema = Joi.object().keys({
  product_name: Joi.string().required(),
  price: Joi.string().required(),
  qty: Joi.string().required(),
  description: Joi.string().required(),
  product_type_id: Joi.string().required()
});

module.exports = { validation, schema }