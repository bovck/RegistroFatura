import User from "../models/user.js";
import bcrypt from "bcrypt";

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
  } catch (err) {
    next(err);
  }
};
