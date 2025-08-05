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




// este codigo no sirve 
import { methods } from "./middleware/methods";
import { eliminar } from "./middleware/delete";
import { createUser, deleteUser, getUserId, getUsers, updateUser } from "./handlers/user";

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



/**
 * 
 * @swagger
 * /api/products:
 *    get:
 *        summary: Obtener una lista de los prdouctos 
 *        tags:
 *            - products
 *        description: regresa una lista de productos
 *        responses:
 *            200:
 *                description: Respuesta exitosa :)
 *                content: 
 *                    application/json:
 *                        schema:
 *                            type: array
 *                            items:
 *                                $ref: '#/components/schemas/product'
 * 
 */
router.get("/products", getProducts);


/**
 * 
 * @swagger
 * /api/products/{id}:
 *    get:
 *        summary: Obtener una lista de los prdouctos por ID
 *        tags:
 *            - products
 *        description: regresa un producto
 *        parameters:
 *             - in: path
 *               name: id
 *               description: El Id del producto a consultar
 *               required: true
 *               schema:
 *                  type: integer
 *        responses:
 *            200:
 *                description: Respuesta exitosa :)
 *                content: 
 *                    application/json:
 *                        schema:
 *                            type: array
 *                            items:
 *                                $ref: '#/components/schemas/product'
 *            404:
 *                description: No encontrado
 *            400:
 *               description: Solicitud erronea - ID invalido  
 *            
 */

router.get(
  "/products/:id",
  param("id").isNumeric().withMessage("El id debe ser numerico"),
  handleInputErrors,
  getProductId
);
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crea un nuevo producto 
 *     tags:
 *       - products
 *     description: Retorna un nuevo registro en la base de datos 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Monitor curvo"
 *               price:
 *                 type: number
 *                 example: 159
 *     responses:
 *       201:
 *         description: Respuesta Exitosa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/product'
 *       400:
 *         description: Mala respuesta
 */


router.post(
  "/products",
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
  "/products/:id",
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
  "/products/:id",
  param("id").isNumeric().withMessage("El id debe ser numerico"),
  handleInputErrors,
  updateAvailability
);

router.delete(
  "/products/:id",
  param("id").isNumeric().withMessage("El id debe ser numerico"),
  handleInputErrors,
  eliminar,
  deleteProduct
);



////////////////////////////////////////////////////

//Usuarios:

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags:
 *       - users
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuarios'
 */

router.get("/users", getUsers);


/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuarios'
 *       404:
 *         description: Usuario no encontrado
 */
router.get(
  "/users/:id",
  param("id").isNumeric().withMessage("tonto el id debe ser numerico"),
  handleInputErrors,
  getUserId
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "Alexis Rodriguez"
 *               email:
 *                 type: string
 *                 example: "rcaalexis@gmail.com"
 *               password:
 *                 type: string
 *                 example: "alexis1234567"
 *               role:
 *                 type: string
 *                 example: "user"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuarios'
 *       400:
 *         description: Datos inválidos
 */
router.post(
  "/users",
  body("username").notEmpty().withMessage("el nombre es requerido"),
  body("password").notEmpty().withMessage("la contraseña es requerida"),
  body("email")
    .notEmpty()
    .withMessage("tonto te falto el correo")
    .isEmail()
    .withMessage("ingrese un correo valido"),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("El rol debe ser 'user' o 'admin'"),
  handleInputErrors,
  createUser
);

router.put(
  "/users/:id",
  param("id").isNumeric().withMessage("el id debe ser numerico"),
  body("username")
    .optional()
    .notEmpty()
    .withMessage("tonto te falto el nombre"),
  body("email")
    .optional()
    .notEmpty()
    .withMessage("tonto te falto el correo")
    .isEmail()
    .withMessage("tonto ingresa una correo valido"),
  handleInputErrors,
  updateUser
);


router.delete(
  "/users/:id",
  param("id").isNumeric().withMessage("tontoo el id tiene que se numerico"),
  handleInputErrors,
  deleteUser
);


export default router;
