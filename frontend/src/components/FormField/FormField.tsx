import React from "react";

import { Form } from "react-bootstrap";

interface IProps {
  controlId: string;
  formLabel: string;
  formType: string;
  placeholder: string;
  onValueChange: (e: any) => void;
  isInvalid: boolean;
  feedbackError: string | null | undefined;
  value: string;
}

const FormField: React.FC<IProps> = ({
  controlId,
  formLabel,
  formType,
  placeholder,
  value,
  isInvalid,
  feedbackError,
  onValueChange,
}) => {
  return (
    <Form.Group className="my-2" controlId={controlId}>
      <Form.Label>{formLabel}</Form.Label>
      <Form.Control
        type={formType}
        placeholder={placeholder}
        value={value}
        onChange={onValueChange}
        isInvalid={isInvalid}
      ></Form.Control>
      <Form.Control.Feedback type="invalid">
        {feedbackError}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default FormField;
