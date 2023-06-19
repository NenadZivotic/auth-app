import React, { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import FormContainer from "../../components/FormContainer/FormContainer";
import Loader from "../../components/Loader/Loader";
import { useLoginMutation } from "../../redux/slices/usersApiSlice";
import { setCredentials } from "../../redux/slices/authSlice";
import { StateModel } from "../../redux/models/state.model";
import {
  emailValidation,
  generalFieldValidator,
  passwordValidation,
  checkForErrors,
} from "../../utils/validators";
import FormField from "../../components/FormField/FormField";
import { ValidationErrors } from "../../models/validationErrors.model";
import { TypeOfValidationField } from "../../models/typeOfValidationField.enum";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({
    email: null,
    password: null,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const userInfo = useSelector(
    ({ auth: { userInfo } }: StateModel) => userInfo
  );

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

  useEffect(() => {
    setDisabled(!checkForErrors(errors));
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo, email, password, errors]);

  const submitHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
      toast.success("Successfully logged in");
    } catch (err: any) {
      toast.error(err?.data?.message || err?.error);
    }
  };

  return (
    <FormContainer>
      <h1>Login</h1>

      <Form onSubmit={submitHandler}>
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

        {isLoading && <Loader />}

        <Button
          type="submit"
          variant="primary"
          className="mt-3"
          disabled={disabled || isLoading}
        >
          Sign In
        </Button>

        <Row className="py-3">
          <Col>
            New User? <Link to="/register">Register</Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
};

export default LoginScreen;
