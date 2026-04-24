import User from "../models/user.js";
export const postCadastro = async (req, res, next) => {
  const nome = req.body.nome;
  console.log(nome);
};
