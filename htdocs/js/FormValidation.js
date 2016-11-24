"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* exported FormValidation */

var FormValidation = {
  createValidator: function createValidator(fieldName, prettyFieldName, rule) {
    return function (formData) {
      var errorMessageFunc = rule(formData, formData[fieldName]);
      if (errorMessageFunc) {
        return _defineProperty({}, fieldName, errorMessageFunc(prettyFieldName));
      } else {
        return _defineProperty({}, fieldName, null);
      }
    };
  },

  generateValidationErrors: function generateValidationErrors(formData, validations) {
    return Object.values(validations).reduce(function (acc, v) {
      return Object.assign(acc, v(formData));
    }, {});
  },

  validateField: function validateField(formData, fieldName, validations) {
    var validationFunc = validations[fieldName];
    if (!validationFunc) {
      return _defineProperty({}, fieldName, null);
    } else {
      return validationFunc(formData);
    }
  },

  rules: {
    required: function required(formData, value) {
      return value ? null : function (fieldName) {
        return fieldName + " is required";
      };
    }
  }
};
