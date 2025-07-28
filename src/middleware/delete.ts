import {param } from "express-validator";

export const eliminar = [
  param("id")
    .isNumeric()
    .withMessage("El id debe ser numerico")
];