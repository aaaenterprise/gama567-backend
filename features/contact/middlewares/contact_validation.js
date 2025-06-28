const Joi = require('joi');

const contactSchema = Joi.object({
    _id:Joi.any(),

    name: Joi.string()
        .required()
        .messages({
            'any.required': 'Name is required.',
            'string.empty': 'Name cannot be empty.',
        }),
    about: Joi.string()
        .required()
        .messages({
            'any.required': 'About is required.',
            'string.empty': 'About cannot be empty.',
        }),
    id: Joi.string()
        // .required()
        .messages({

            'string.empty': 'ID cannot be empty.',
        }),
    profileId: Joi.string()
        .required()
        .messages({
            'any.required': 'Profile ID is required.',
            'string.empty': 'Profile ID cannot be empty.',
        }),
    dateOfBirth: Joi.date()
        .iso()
        .messages({
            'date.base': 'Date of birth must be a valid ISO date.',
            'date.iso': 'Date of birth must be in ISO date format.',
        }),

    tag: Joi.array()
        .items(
            Joi.string()
                .required()
                .messages({
                    'any.required': 'Tag item is required.',
                    'string.empty': 'Tag item cannot be empty.',
                })
        )
        .required()
        .messages({
            'any.required': 'At least one tag is required.',
            'array.base': 'Tags must be provided as an array.',
            'array.required': 'At least one tag is required.',
        }),
    profileImage: Joi.string()
        .uri()
        .messages({
            'string.uri': 'Profile image must be a valid URI.',
        }),
    mobileNumbers: Joi.array()
        .items(
            Joi.object({
                _id: Joi.any(),

                // .messages({

                //     'string.empty': 'Mobile ID cannot be empty.',
                // }),
                title: Joi.string()
                    .required()
                    .messages({
                        'any.required': 'Mobile number title is required.',
                        'string.empty': 'Mobile number title cannot be empty.',
                    }),
                number: Joi.number()
                    .required()
                    .messages({
                        'any.required': 'Mobile number is required.',
                        'number.base': 'Mobile number must be a number.',
                    }),
            })
        ).min(1).required(),
    emailId: Joi.array()
        .items(
            Joi.object({
                _id: Joi.any(),
                title: Joi.string()
                    .required()
                    .messages({
                        'any.required': 'Email title is required.',
                        'string.empty': 'Email title cannot be empty.',
                    }),
                email: Joi.string()
                    .email()
                    .required()
                    .messages({
                        'any.required': 'Email is required.',
                        'string.empty': 'Email cannot be empty.',
                        'string.email': 'Invalid email format.',
                    }),
            })
        ),
    socialMedia: Joi.array()
        .items(
            Joi.object({
                _id: Joi.any(),
                title: Joi.string()
                    .required()
                    .messages({
                        'any.required': 'Social media title is required.',
                        'string.empty': 'Social media title cannot be empty.',
                    }),
                url: Joi.string()
                    .uri()
                    .required()
                    .messages({
                        'any.required': 'Social media URL is required.',
                        'string.empty': 'Social media URL cannot be empty.',
                        'string.uri': 'Social media URL must be a valid URI.',
                    }),
            })
        ),
    notes: Joi.array()
        .items(
            Joi.object({
                title: Joi.string()
                    .required()
                    .messages({
                        'any.required': 'Note title is required.',
                        'string.empty': 'Note title cannot be empty.',
                    }),
                content: Joi.string()
                    .required()
                    .messages({
                        'any.required': 'Note content is required.',
                        'string.empty': 'Note content cannot be empty.',
                    }),
                _id: Joi.any(),
                createdAt: Joi.date()

                    .messages({
                        'date.base': 'Note creation date must be a valid ISO date.',
                        'date.iso': 'Note creation date must be in ISO date format.',
                    }),
            })
        ),
});





module.exports = {
    contactSchema
};












// // Validate the request data before creating or updating a contact
// const validateContactData = (req, res, next) => {
//     const { error } = contactSchema.validate(req.body);
//     if (error) {
//         return res.status(400).json({ error: error.details[0].message });
//     }
//     next();
// };

// module.exports = {
//     validateContactData,
// };