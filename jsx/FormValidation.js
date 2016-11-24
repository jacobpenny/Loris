/* exported FormValidation */

var FormValidation = {
  createValidator: function(fieldName, prettyFieldName, rule) {
    return function(formData) {
      const errorMessageFunc = rule(formData, formData[fieldName]);
      if (errorMessageFunc) {
        return {[fieldName]: errorMessageFunc(prettyFieldName)};
      } else {
        return {[fieldName]: null};
      }
    }
  },

  generateValidationErrors: function(formData, validations) {
    return Object.values(validations).reduce((acc, v) => {
      return Object.assign(acc, v(formData));
    }, {});
  },

  validateField: function(formData, fieldName, validations) {
    const validationFunc = validations[fieldName];
    if (!validationFunc) {
      return {[fieldName]: null};
    } else {
      return validationFunc(formData);
    }
  },

  rules: {
    required: function(formData, value) {
      return value ? null : (fieldName) => `${fieldName} is required`;
    }
  }
};

