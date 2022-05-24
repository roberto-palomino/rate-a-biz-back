const Joi = require('joi');

// Pendiente de hacer comprobaciones para idStates, idJobs, idSalaries, start_year, end_year, salary, enviroment, conciliation, oportunities

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
    idStates: Joi.number()
        .required()
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('La propiedad [idStates] es requerida');

                default:
                    return new Error(
                        'Debe seleccionar una Provincia de entre las opciones'
                    );
            }
        }),
    idJobs: Joi.number()
        .required()
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('La propiedad [idJobs] es requerida');

                default:
                    return new Error(
                        'Debe seleccionar un Trabajo de entre las opciones'
                    );
            }
        }),
    idSalaries: Joi.number()
        .required()
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('La propiedad [idSalaries] es requerida');

                default:
                    return new Error(
                        'Debe seleccionar un Rango salarial de entre las opciones'
                    );
            }
        }),
    start_year: Joi.number()
        .required()
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('La propiedad [start_year] es requerida');

                default:
                    return new Error(
                        'Debe seleccionar un Año de comienzo de entre las opciones'
                    );
            }
        }),
    end_year: Joi.number()
        .required()
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('La propiedad [end_year] es requerida');

                default:
                    return new Error(
                        'Debe seleccionar un Año fin de entre las opciones'
                    );
            }
        }),
    enviroment: Joi.number()
        .required()
        .min(1)
        .max(5)
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('La propiedad [enviroment] es requerida');

                default:
                    return new Error(
                        'La propiedad ambiente laboral debe tener un valor entre 1 y 5'
                    );
            }
        }),
    conciliation: Joi.number()
        .required()
        .min(1)
        .max(5)
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error(
                        'La propiedad [conciliation] es requerida'
                    );

                default:
                    return new Error(
                        'La propiedad conciliación debe tener un valor entre 1 y 5'
                    );
            }
        }),
    oportunities: Joi.number()
        .required()
        .min(1)
        .max(5)
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error(
                        'La propiedad [oportunities] es requerida'
                    );

                default:
                    return new Error(
                        'La propiedad oportunidades debe tener un valor entre 1 y 5'
                    );
            }
        }),
    salary: Joi.number()
        .required()
        .min(1)
        .max(5)
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('La propiedad [salary] es requerida');

                default:
                    return new Error(
                        'La propiedad salario debe tener un valor entre 1 y 5'
                    );
            }
        }),
});

module.exports = newReviewSchema;
