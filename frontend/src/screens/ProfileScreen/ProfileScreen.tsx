import React, { useState, useEffect } from "react";

import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import FormContainer from "../../components/FormContainer/FormContainer";
import Loader from "../../components/Loader/Loader";
import { setCredentials } from "../../redux/slices/authSlice";
import { StateModel } from "../../redux/models/state.model";
import { useUpdateUserMutation } from "../../redux/slices/usersApiSlice";
import FormField from "../../components/FormField/FormField";
import {
  checkForErrors,
  confirmPasswordValidation,
  emailValidation,
  generalFieldValidator,
  nameValidation,
  passwordValidation,
} from "../../utils/validators";
import { TypeOfValidationField } from "../../models/typeOfValidationField.enum";
import { ValidationErrors } from "../../models/validationErrors.model";

const ProfileScreen: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({
    name: null,
    email: null,
    password: null,
    confirmPassword: null,
  });

  const dispatch = useDispatch();

  const userInfo = useSelector(
    ({ auth: { userInfo } }: StateModel) => userInfo
  );

  const validateName = (name: string): void => {
    const validName = nameValidation(name);

    setErrors({
      ...errors,
      name: generalFieldValidator(TypeOfValidationField.Name, validName),
    });
    setDisabled(!validName);
  };

  const validateEmail = (email: string): void => {
    const validEmail = emailValidation(email);

    setErrors({
      ...errors,
      email: generalFieldValidator(TypeOfValidationField.Email, validEmail),
    });
    setDisabled(!validEmail);
  };

  const validatePassword = (password: string): void => {
    const validPassword = passwordValidation(password, 6);

    setErrors({
      ...errors,
      password: generalFieldValidator(
        TypeOfValidationField.Password,
        validPassword
      ),
    });
    setDisabled(!validPassword);
  };

  const validateConfirmPassword = (confirmPassword: string): void => {
    const validConfirmPassword = confirmPasswordValidation(
      password,
      confirmPassword
    );

    setErrors({
      ...errors,
      confirmPassword: generalFieldValidator(
        TypeOfValidationField.ConfirmPassword,
        validConfirmPassword
      ),
    });
    setDisabled(!validConfirmPassword);
  };

  const [updateProfile, { isLoading }] = useUpdateUserMutation();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  useEffect(() => {
    setDisabled(!checkForErrors(errors));
  }, [errors]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await updateProfile({
        _id: userInfo?._id,
        name,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <h1>Update Profile</h1>

      <Form onSubmit={submitHandler}>
        <FormField
          controlId="name"
          formLabel="Name"
          formType="text"
          placeholder="Enter Name"
          value={name}
          onValueChange={(e) => {
            validateName(e.target.value);
            setName(e.target.value);
          }}
          isInvalid={!!errors?.name?.length}
          feedbackError={errors?.name}
        />

        <FormField
          controlId="email"
          formLabel="Email Address"
          formType="email"
          placeholder="Enter Email"
          value={email}
          onValueChange={(e) => {
            validateEmail(e.target.value);
            setEmail(e.target.value);
          }}
          isInvalid={!!errors?.email?.length}
          feedbackError={errors?.email}
        />

        <FormField
          controlId="password"
          formLabel="Password"
          formType="password"
          placeholder="Enter Password"
          value={password}
          onValueChange={(e) => {
            validatePassword(e.target.value);
            setPassword(e.target.value);
          }}
          isInvalid={!!errors?.password?.length}
          feedbackError={errors?.password}
        />

        <FormField
          controlId="confirmPassword"
          formLabel="Confirm Password"
          formType="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onValueChange={(e) => {
            validateConfirmPassword(e.target.value);
            setConfirmPassword(e.target.value);
          }}
          isInvalid={!!errors?.confirmPassword?.length}
          feedbackError={errors?.confirmPassword}
        />

        {isLoading && <Loader />}

        <Button
          type="submit"
          variant="primary"
          className="mt-3"
          disabled={disabled || isLoading}
        >
          Update
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ProfileScreen;
