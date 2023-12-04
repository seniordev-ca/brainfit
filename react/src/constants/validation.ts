import Joi from 'joi';
import { joiPassword } from 'joi-password';


// const joiPostalCode = Joi.extend(require('joi-postalcode'));

// function defaultRequiredMessages(id: string) {
//   return {
//     'any.required': `${id}:Please complete this field`,
//     'string.empty': `${id}:Please complete this field`
//   };
// }

const homeSchema = Joi.object({}).options({ allowUnknown: true });

function defaultRequiredMessages(id: string) {
  return {
    'any.required': `Please complete this field`,
    'string.empty': `Please complete this field`
  };
}

const notRecognizedStr: string = 'Email or password not recognized in our system. Please try another email or password.'

// const step9Schema = Joi.object({
//   addressOne: Joi.string()
//     .required()
//     .messages({ ...defaultRequiredMessages('addressOne') }),
//   city: Joi.string()
//     .required()
//     .messages({ ...defaultRequiredMessages('city') }),
//   province: Joi.string()
//     .required()
//     .messages({ ...defaultRequiredMessages('province') }),
//   postalCode: joiPostalCode
//     .string()
//     .postalCode('CA')
//     .required()
//     .messages({
//       ...defaultRequiredMessages('postalCode'),
//       'postalCode.invalid': 'postalCode:Incorrect format - A1A A1A'
//     }),
//   country: Joi.string()
//     .required()
//     .messages({ ...defaultRequiredMessages('country') }),
//   phoneNumber: Joi.string()
//     .required()
//     .messages({ ...defaultRequiredMessages('phoneNumber') })
// }).options({ allowUnknown: true });

const passwordErrorMsg = 'Please add a password that is at least 8 characters and includes at least 1 number, 1 uppercase letter,and 1 special character.';
const signUpSchema = Joi.object({
  name: Joi.string().trim().min(1)
    .required()
    .messages({ ...defaultRequiredMessages('name') }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required()
    .messages({
      ...defaultRequiredMessages('email'),
      'string.email': 'Please add a valid email address'
    }),
  // password: Joi.string().min(8)
  //   .required()
  //   .messages({
  //     ...defaultRequiredMessages('password'),
  //     'string.min': 'Invalid password length',
  //   }),
  password: joiPassword
    .string()
    .min(8)
    .minOfSpecialCharacters(1) //
    .minOfUppercase(1) //
    .minOfNumeric(1) //
    .noWhiteSpaces() //
    .required()
    .messages({
      ...defaultRequiredMessages('password'),
      'string.min': passwordErrorMsg,
      'password.minOfUppercase': passwordErrorMsg,
      'password.minOfSpecialCharacters': passwordErrorMsg,
      'password.minOfNumeric': passwordErrorMsg,
      'password.noWhiteSpaces': passwordErrorMsg,
    })
}).options({ allowUnknown: true });

const signInSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required()
    .messages({
      ...defaultRequiredMessages('email'),
      'string.email': notRecognizedStr
    }),
  password: Joi.string().min(8)
    .required()
    .messages({
      ...defaultRequiredMessages('password'),
      'string.min': notRecognizedStr,
    }),
}).options({ allowUnknown: true });

const emailSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required()
    .messages({
      ...defaultRequiredMessages('email'),
      'string.email': 'Incorrect email format'
    })
}).options({ allowUnknown: true });

const newPasswordSchema = Joi.object({
  password: joiPassword
    .string()
    .min(8)
    .minOfSpecialCharacters(1) //
    .minOfUppercase(1) //
    .minOfNumeric(1) //
    .noWhiteSpaces() //
    .required()
    .messages({
      ...defaultRequiredMessages('password'),
      'string.min': passwordErrorMsg,
      'password.minOfUppercase': passwordErrorMsg,
      'password.minOfSpecialCharacters': passwordErrorMsg,
      'password.minOfNumeric': passwordErrorMsg,
      'password.noWhiteSpaces': passwordErrorMsg,
    }),
  confirmPassword: Joi.any().equal(Joi.ref('password'))
    .required()
    .label('Password')
    .messages({ 'any.only': '{{#label}} does not match' })
})

export const validationSchemas: { [key: string]: Joi.ObjectSchema } = {
  home: homeSchema,
  signup: signUpSchema,
  signin: signInSchema,
  reset: emailSchema,
  changeEmail: emailSchema,
  newPass: newPasswordSchema
};

export function parseErrorText(errorString: string) {
  const returnObject: { [key: string]: string } = {};

  const fieldErrors: string[] = errorString
    .replace('ValidationError: ', '')
    .split('.');
  fieldErrors.forEach((errorText) => {
    const components = errorText.split(':');
    const key = components[0].trim();
    const value = components[1].trim();
    returnObject[key] = value;
  });
  return returnObject;
}
