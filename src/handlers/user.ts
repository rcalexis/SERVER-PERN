import { Request, Response } from "express";
import User from "../models/Usuario.mo";
import colors from "colors";

// Crear usuario
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ error: "email ya existe" });
    }

    const existsUsername = await User.findOne({ where: { username } });
    if (existsUsername) {
      return res.status(400).json({ error: "username ya existe" });
    }

    const user = await User.create({ username, email, password, role });
    res.status(201).json({ data: user });
  } catch (error) {
    console.log(colors.white.bgRed.bold("Hubo un error al crear usuario"));
    res.status(500).json({ error: "Error del servidor" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { username, page = 1, limit = 10 } = req.query;

    const where: any = {};
    if (username) where.username = username;

    const users = await User.findAll({
      where,
      offset: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
    });

    res.json({ data: users });
  } catch (error) {
    console.log(colors.white.bgRed.bold("Hubo un error al obtener usuarios"));
    res.status(500).json({ error: "Error del servidor" });
  }
};

export const getUserId = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ data: user });
  } catch (error) {
    console.log(colors.white.bgRed.bold("Hubo un error al obtener usuario por id"));
    res.status(500).json({ error: "Error del servidor" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "no se encontro el usuario" });

    const { username, email, role, isActive, password, id: idcuerpo } = req.body;

    if (password !== undefined) {
      return res.status(400).json({ error: "No se puede actualizar la contraseña" });
    }

    if (idcuerpo !== undefined) {
      return res.status(400).json({ error: "No se puede actualizar el ID" });
    }

    await user.update({ username, email, role, isActive });
    res.json({ data: user });
  } catch (error) {
    console.log(colors.white.bgRed.bold("Hubo un error al actualizar usuario"));
    res.status(500).json({ error: "Error del servidor" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    user.isActive = false;
    await user.save();

    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    console.log(colors.white.bgRed.bold("Hubo un error al eliminar usuario"));
    res.status(500).json({ error: "Error del servidor" });
  }
};
