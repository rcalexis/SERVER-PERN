
import  { Router }  from "express";
import { createProduct, updateProduct } from "./handlers/product";
import { handleInputErrors } from "./middleware";
import { Validate } from "sequelize-typescript";
import { post } from "./middleware/posts";
import { put } from "./middleware/put";


const router = Router()

router.get('/',handleInputErrors,(req, res)=>{
    res.send("hola ya casi pasas el parcial")
})

//create 
router.post('/',post,handleInputErrors, createProduct);


router.put('/',put,updateProduct,handleInputErrors,(req, res)=>{
    res.send("hola desde put")
})


router.delete('/',handleInputErrors,(req, res)=>{
    res.send("hola desde delete")
})
export default router