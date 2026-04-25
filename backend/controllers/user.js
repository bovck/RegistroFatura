import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//
// CADASTRANDO USUARIO
//
export const postCadastro = async (req, res, next) => {
  const nome = req.body.nome;
  const sobrenome = req.body.sobrenome;
  const email = req.body.email;
  const senha = req.body.senha;

  try {
    const emailExiste = await User.findOne({ email: email });
    if (emailExiste) {
      const error = new Error("Esse e-mail já existe");
      error.statusCode = 500;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(senha, 12);
    const user = new User({
      nome: nome,
      sobrenome: sobrenome,
      email: email,
      senha: hashedPassword,
    });
    await user.save();
    res.status(201).json({
      message: "conta criada com sucesso",
    });
  } catch (error) {
    next(error);
  }
};

//
// Logando Usuário
//
export const postLogin = async (req, res, next) => {
  const email = req.body.email;
  const senha = req.body.senha;

  const user = await User.findOne({ email: email });

  if (!user) {
    const error = new Error("Usuário inválido");
    error.statusCode = 500;
    throw error;
  }
  const isEqual = await bcrypt.compare(senha, user.senha);

  if (!isEqual) {
    const error = new Error("Usuário inválido");
    error.statusCode = 500;
    throw error;
  }

  const token = jwt.sign(
    {
      email: user.email,
      userId: user._id.toString(),
    },
    "secret",
    { expiresIn: "1h" },
  );

  res.status(200).json({
    message: "usuário logado",
    token: token,
    userId: user._id.toString(),
  });
};
