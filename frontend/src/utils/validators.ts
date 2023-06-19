import { TypeOfValidationField } from "../models/typeOfValidationField.enum";
import { ValidationErrors } from "./../models/validationErrors.model";

export const nameValidation = (name: string): boolean => {
  return name.length > 1;
};

export const emailValidation = (email: string): boolean => {
  const validEmail =
    !!String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ) && !!email.length;
  return validEmail;
};

export const passwordValidation = (
  password: string,
  minimumPasswordLength: number
): boolean => {
  return password.length >= minimumPasswordLength;
};

export const confirmPasswordValidation = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword;
};

export const checkForErrors = (errors: ValidationErrors): boolean => {
  return Object.values(errors).every((value) => {
    if (value === null || value === undefined || value === false) {
      return true;
    }
    return false;
  });
};

export const generalFieldValidator = (
  fieldToValidate: TypeOfValidationField,
  isFieldValid: boolean
): string | null | undefined => {
  const validationMap = new Map<TypeOfValidationField, string>();

  validationMap
    .set(
      TypeOfValidationField.Email,
      "Your email is invalid. Please check your input and try again"
    )
    .set(
      TypeOfValidationField.Name,
      "Name is required and must be longer than 1 character"
    )
    .set(
      TypeOfValidationField.Password,
      "Your password should have at least 6 characters"
    )
    .set(TypeOfValidationField.ConfirmPassword, "Passwords should match");

  return !isFieldValid ? validationMap.get(fieldToValidate) : null;
};
