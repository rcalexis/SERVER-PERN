import { body } from "express-validator";

export const post = [
  body("name")
    .notEmpty()
    .withMessage("El nombre es un campo requerido"),

  body("price")
    .notEmpty()
    .withMessage("El precio es un campo requerido")
    .isNumeric()
    .withMessage("El dato no es numérico")
    .custom((value) => value > 0)
    .withMessage("El precio debe ser mayor a 0"),
];
