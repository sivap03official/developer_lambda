const schemagenerator = require("fluent-json-schema")
const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const signUp = schemagenerator.object()
    .prop("name", schemagenerator.string().minLength(3).maxLength(50).required())
    .prop("email", schemagenerator.string().pattern(pattern).required())
    .prop("password", schemagenerator.string().minLength(8).maxLength(16).pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]").required())
    .prop("mobile", schemagenerator.string().pattern("^[0-9]{10}$")).valueOf()

const logIn = schemagenerator.object()
    .prop("email", schemagenerator.string().pattern(pattern).required())
    .prop("password", schemagenerator.string().minLength(8).maxLength(16).pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]").required())
    .valueOf()

const address = schemagenerator.object()
    .prop("name", schemagenerator.string().minLength(3).maxLength(50).required())
    .prop("email", schemagenerator.string().pattern(pattern).required())
    .prop("mobile", schemagenerator.string().pattern("^[0-9]{10}$")).required()
    .prop("addressLine1", schemagenerator.string().required())
    .prop("addressLine2", schemagenerator.string())
    .prop("street", schemagenerator.string().required())
    .prop("city", schemagenerator.string().required())
    .prop("state", schemagenerator.string().required())
    .prop("country", schemagenerator.string().required())
    .prop("zip", schemagenerator.string().pattern("^[0-9]{5}$").required())
    .valueOf()

const schemas = {
    signUp,
    logIn,
    address
}
module.exports = {
   schemas
}