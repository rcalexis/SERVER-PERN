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

/**
 * @swagger
 * components:
 *      schemas:
 *          Product:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: The Product ID
 *                      example: 1
 *                  name:
 *                      type: string
 *                      description: The Product name
 *                      example: Monitor Curvo de 49 Pulgadas
 *                  price:
 *                      type: number
 *                      description: The Product price
 *                      example: 300
 *                  availability:
 *                      type: boolean
 *                      description: The Product availability
 *                      example: true
 */


//hacerlo pero con el de usuarios
/**
 * @swagger
 * components:
 *      schemas:
 *          Usuarios:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: El Id del usuario
 *                      example: 1
 *                  username:
 *                      type: string
 *                      description: El nombre del usuario
 *                      example: Alexis Rodriguez
 *                  email:
 *                      type: string
 *                      description: El email del usuario
 *                      example: rcaalexis@gmail.com
 *                  password:
 *                      type: string
 *                      description: La contraseña del usuario
 *                      example: alexis1234567
 *                  role:
 *                      type: string
 *                      description: El rol del usuario 
 *                      example: Admin
 */
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
