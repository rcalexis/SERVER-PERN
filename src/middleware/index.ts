import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Entro al middleware");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
