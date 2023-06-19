import React from "react";

import { Spinner } from "react-bootstrap";

const Loader: React.FC = () => {
  return (
    <Spinner
      animation="border"
      role="status"
      className="m-auto d-block"
      style={{ width: "100px", height: "100px" }}
    ></Spinner>
  );
};

export default Loader;
