import React from "react";

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { StateModel } from "../../redux/models/state.model";

const PrivateRoute: React.FC = () => {
  const userInfo = useSelector(
    ({ auth: { userInfo } }: StateModel) => userInfo
  );

  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
