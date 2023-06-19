import React, { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import FormContainer from "../../components/FormContainer/FormContainer";
import Loader from "../../components/Loader/Loader";
import { useRegisterMutation } from "../../redux/slices/usersApiSlice";
import { setCredentials } from "../../redux/slices/authSlice";
import { StateModel } from "../../redux/models/state.model";
import FormField from "../../components/FormField/FormField";
import { ValidationErrors } from "../../models/validationErrors.model";
import {
  checkForErrors,
  confirmPasswordValidation,
  emailValidation,
  generalFieldValidator,
  nameValidation,
  passwordValidation,
} from "../../utils/validators";
import { TypeOfValidationField } from "../../models/typeOfValidationField.enum";

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({
    name: null,
    email: null,
    password: null,
    confirmPassword: null,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading }] = useRegisterMutation();

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

  useEffect(() => {
    setDisabled(!checkForErrors(errors));
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo, errors]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err: any) {
      toast.error(err?.data?.message || err?.error);
    }
  };

  return (
    <FormContainer>
      <h1>Register</h1>

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
          Sign Up
        </Button>

        <Row className="py-3">
          <Col>
            Already have an account? <Link to="/login">Login</Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
};

export default RegisterScreen;
