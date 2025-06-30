import {Request, Response} from 'express'
import {body, ExpressValidator} from 'express-validator'
import Product from '../models/Producto.mo';
//create 
export const createProduct = async (req:Request, res: Response)=>{
    // const product = new Product(req.body)
    // product.save()
    // console.log(req.body);
    // res.send("hola desde post")
    //validar nombre y precio 
    const product = await Product.create(req.body)
    res.json({data: product})

}

export const getProducts = async (req: Request, res: Response) =>{
  const product = await Product.findAll();
  
  res.json({ data: product }); 
}

export const getProductId = async (req: Request, res: Response) => {
  const {id} = req.params;

  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json({ data: product });

}

export const updateProduct = async (req: Request, res: Response) => {
  const {id} = req.params;

  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  await product.update(req.body);

  res.json({ data: product });

}

export const deleteProduct = async (req: Request, res: Response) => {
  const {id} = req.params;

  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  await product.destroy(req.body);

  res.json({ message: "Producto eliminado" });

}