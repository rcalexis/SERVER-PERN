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

const router = Router();


router.get("/", handleInputErrors, getProducts);


router.get(
  "/:id",
  param("id").isNumeric().withMessage("id no es numerico"),
  handleInputErrors,
  getProductId
);


router.post(
  "/",
  body("name").notEmpty().withMessage("tonto te falto el nombre"),
  body("price")
    .notEmpty().withMessage("tonto te falto el precio")
    .isNumeric().withMessage("el dato no es numerico")
    .custom((value) => value > 0).withMessage("el numero tiene que ser mayor a 0"),
  handleInputErrors,
  createProduct
);


router.put(
  "/:id",
  param("id").isNumeric().withMessage("id no es numerico"),
  body("name").notEmpty().withMessage("tonto te falto el nombre"),
  body("price")
    .notEmpty().withMessage("tonto te falto el precio")
    .isNumeric().withMessage("el dato no es numerico")
    .custom((value) => value > 0).withMessage("Valor no valido"),
  handleInputErrors,
  updateProduct
);


router.patch(
  "/:id",
  param("id").isInt().withMessage("id no valido"),
  handleInputErrors,
  updateAvailability
);


router.delete(
  "/:id",
  param("id").isInt().withMessage("id no es numerico"),
  handleInputErrors,
  deleteProduct
);

export default router;
