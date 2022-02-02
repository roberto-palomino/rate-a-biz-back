const Joi = require('joi');

const newReviewSchema = Joi.object().keys({
    title: Joi.string()
        .required()
        .min(3)
        .max(50)
        .regex(/^[A-Za-z0-9 ÁÉÍÓÚáéíóúÑñ]*$/)
        .error((errors) => {
            console.log(errors[0].code);
            if (errors[0].code === 'any.required') {
                return new Error('La propiedad [title] es requerida');
            } else if (errors[0].code === 'string.pattern.base') {
                return new Error(
                    'La propiedad [title] solo puede contener letras o números'
                );
            } else {
                return new Error(
                    'La propiedad [title] debe tener entre 3 y 50 caracteres'
                );
            }
        }),
    description: Joi.string()
        .required()
        .min(20)
        .max(500)
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('La propiedad [description] es requerida');

                default:
                    return new Error(
                        'La propiedad [description] debe tener entre 20 y 500 caracteres'
                    );
            }
        }),
});

module.exports = newReviewSchema;
