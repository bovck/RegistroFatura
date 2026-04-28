import Fatura from "../models/fatura.js";
import User from "../models/user.js";

export const postFatura = async (req, res, next) => {
  const creditor = req.body.creditor;
  const amount = req.body.amount;
  const month = req.body.months;
  const fatura = new Fatura({
    creditor: creditor,
    amount: amount,
    month: month,
    criador: req.userId,
  });
  try {
    await fatura.save();
    const user = await User.findById(req.userId);
    user.faturas.push(fatura);
    await user.save();

    res.status(201).json({
      message: "Produto criado",
      fatura: fatura,
      creator: { _id: user._id, name: user.name },
    });
  } catch (err) {
    next(err);
  }
};

export const getFatura = async (req, res, next) => {
  try {
    const fatura = await Fatura.find();
    res.status(200).json({
      message: "Os produtos foram buscados com sucesso",
      fatura: fatura,
    });
  } catch (error) {
    console.log(error);
  }
};
