
import  { Router }  from "express";

const router = Router()

router.get('/',(req, res)=>{
    res.send("hola ya casi pasas el parcial")
})

router.post('/',(req, res)=>{
    res.send("hola desde post")
})

router.put('/',(req, res)=>{
    res.send("hola desde put")
})

router.delete('/',(req, res)=>{
    res.send("hola desde delete")
})
export default router