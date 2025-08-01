import { Request, Response } from "express";
import { body, ExpressValidator } from "express-validator";
import Product from "../models/Producto.mo";
import  colors  from "colors";
//create
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ data: product });
  } catch (error) {
    
    console.log(colors.white.bgRed.bold("Hubo un error al crear producto"));
  }
};



export const getProducts = async (req: Request, res: Response) => {
  try {
    const product = await Product.findAll({
      order: [["price", "DESC"]],
    });
    res.json({ data: product });
  } catch (error) {
   
    console.log(colors.white.bgRed.bold("Hubo un error al obtener producto"));
  }
};

export const getProductId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ data: product });
  } catch (error) {
    
    console.log(colors.white.bgRed.bold("Hubo un error al obtener producto por id"));
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  await product.update(req.body);
  await product.save();
  res.json({ data: product });
};

export const updateAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    product.availability = !product.availability;
    await product.save();

    res.json({ data: product });
  } catch (error) {
    console.log(colors.white.bgRed.bold("Hubo un error al editar el campo availability"));
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  await product.destroy(req.body);
  res.json({ message: "Producto eliminado" });
};
