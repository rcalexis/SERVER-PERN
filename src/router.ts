
import { Router } from "express";
import {createProduct,updateProduct,getProducts,getProductId, updateAvailability, deleteProduct,} from "./handlers/product";
import { handleInputErrors } from "./middleware";
import { Validate } from "sequelize-typescript";
import { post } from "./middleware/posts";
import { put } from "./middleware/put";
import { body, param, query } from "express-validator";
import { createUser, getUsers, permDeleteUser, updateUser } from "./handlers/user";

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


router.delete("/:id", handleInputErrors, deleteProduct, (req, res) => {
  res.send("hola desde delete");
});



//usuarios
router.post(
  "/users",
  body("username").notEmpty().withMessage("tonto te falto el nombre"),
  body("email").isEmail().withMessage("ingresa un correo valido"),
  body("password").notEmpty().withMessage("tonto te falto la cotraseña"),
  body("role").optional().isIn(["user", "admin"]),
  handleInputErrors,
  createUser
);

router.get(
  "/users",
  handleInputErrors,
  getUsers
);

router.put(
  "/users/:id",
  param("id").isInt(),
  body("username").optional().isString(),
  body("email").optional().isEmail(),
  body("role").optional().isIn(["user", "admin"]),
  body("isActive").optional().isBoolean(),
  handleInputErrors,
  updateUser
);


router.delete(
  "/users/:id",
  param("id").isInt(),
  handleInputErrors,
  permDeleteUser
);


export default router;

