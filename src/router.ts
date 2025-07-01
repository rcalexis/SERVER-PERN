
import { Router } from "express";
import {createProduct,updateProduct,getProducts,getProductId, updateAvailability,} from "./handlers/product";
import { handleInputErrors } from "./middleware";
import { Validate } from "sequelize-typescript";
import { post } from "./middleware/posts";
import { put } from "./middleware/put";
import { body, param } from "express-validator";

const router = Router();

router.get("/", getProducts, handleInputErrors, (req, res) => {
  res.send("hola ya casi pasas el parcial");
});

router.get(
  "/:id",
  param("id").isNumeric().isInt().withMessage("id no es numerico"),
  handleInputErrors,
  getProductId
);

//create
// router.post('/',post,handleInputErrors, createProduct);
router.post(
  "/",
  body("name").notEmpty().withMessage("tonto te falto el nombre"),
  body("price")
    .notEmpty()
    .withMessage("tonto te falto el nombre")
    .isNumeric()
    .withMessage("el dato no es numerico")
    .custom((value) => value > 0)
    .withMessage("el numero tiene que ser mayor a 0"),
  handleInputErrors,
  createProduct
);

router.put(
  "/:id",
  param("id").isNumeric().isInt().withMessage("id no es numerico"),
  body("name").notEmpty().withMessage("tonto te falto el nombre"),
  body("price")
    .notEmpty()
    .withMessage("tonto te falto el nombre")
    .isNumeric()
    .withMessage("el dato no es numerico")
    .custom((value) => value > 0)
    .withMessage("Valor no valido"),
  updateProduct,
  handleInputErrors
);

router.patch(
  "/:id",
  param("id").isInt().withMessage("id no valido"),
  updateAvailability,
  handleInputErrors
);


router.delete("/", handleInputErrors, (req, res) => {
  res.send("hola desde delete");
});
export default router;

