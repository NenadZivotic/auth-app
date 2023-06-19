import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

import { HttpStatus } from "../models/httpStatus.enum.js";
import { EnvironmentStatus } from "../models/envStatus.enum.js";

const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(HttpStatus.NotFound);
  next(error);
};

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode =
    res.statusCode === HttpStatus.Success
      ? HttpStatus.ServerError
      : res.statusCode;
  let message = err.message;

  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = "Resource not found";
    statusCode = HttpStatus.NotFound;
  }

  return res.status(statusCode).json({
    message,
    stack:
      process.env.NODE_ENV === EnvironmentStatus.Production ? null : err.stack,
  });
};

export { notFound, errorHandler };
