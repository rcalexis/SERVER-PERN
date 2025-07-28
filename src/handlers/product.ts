import { Request, Response } from "express";
import { body, ExpressValidator } from "express-validator";
import Product from "../models/Producto.mo";


//create
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ data: product });
  } catch (error) {
    // console.log(error);
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const product = await Product.findAll({
      order: [["price", "DESC"]],
    });

    res.json({ data: product });
  } catch (error) {
    // console.log(error);
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
    // console.log(error);
  }
};



export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    await product.update(req.body);
    await product.save();

    res.json({ data: product });
  } catch (error) {
    // console.log(error);
  }
};


export const updateAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    product.availability = !product.dataValues.availibility
    await product.save();

    res.json({ data: product });
  } catch (error) {
    // console.log(error);
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


