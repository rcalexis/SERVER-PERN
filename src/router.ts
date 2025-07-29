import { Router } from "express";
import {
  createProduct,
  updateProduct,
  getProducts,
  getProductId,
  updateAvailability,
  deleteProduct,
} from "./handlers/product";
import { handleInputErrors } from "./middleware";
import { body, param } from "express-validator";
import { methods } from "./middleware/methods";
import { eliminar } from "./middleware/delete";

const router = Router();

router.use(methods);

router.get("/", getProducts);

router.get(
  "/:id",
  param("id").isNumeric().withMessage("El id debe ser numerico"),
  handleInputErrors,
  getProductId
);

router.post(
  "/",
  body("name").notEmpty().withMessage("El nombre es un campo requerido"),

  body("price")
    .notEmpty()
    .withMessage("El precio es un campo requerido")
    .isNumeric()
    .withMessage("El dato no es numerico")
    .toFloat()
    .custom((value) => value > 0)
    .withMessage("El precio debe ser mayor a 0"),

  handleInputErrors,
  createProduct
);

router.put(
  "/:id",
  param("id").isNumeric().withMessage("El id debe ser numerico"),

  body("name").notEmpty().withMessage("El nombre es un campo requerido"),

  body("price")
    .notEmpty()
    .withMessage("El precio es un campo requerido")
    .isNumeric()
    .withMessage("El dato no es numerico")
    .toFloat()
    .custom((value) => value > 0)
    .withMessage("El precio debe ser mayor a 0"),

  body("availability")
    .isBoolean()
    .withMessage("La disponibilidad debe ser booleana"),

  handleInputErrors,
  updateProduct
);

router.patch(
  "/:id",
  param("id").isNumeric().withMessage("El id debe ser numerico"),
  handleInputErrors,
  updateAvailability
);

router.delete(
  "/:id",
  param("id").isNumeric().withMessage("El id debe ser numérico"),
  handleInputErrors,
  eliminar,
  deleteProduct
);

export default router;
