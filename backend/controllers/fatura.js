import Fatura from "../models/fatura.js";
import User from "../models/user.js";

function validateFaturaInput(creditor, amount, months) {
  const cleanCreditor = creditor?.trim();
  const parsedAmount = Number(amount);
  const parsedMonths = Number(months);

  if (!cleanCreditor || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    const error = new Error("Dados da fatura inválidos.");
    error.statusCode = 422;
    throw error;
  }

  if (!Number.isInteger(parsedMonths) || parsedMonths < 1) {
    const error = new Error("A quantidade de meses deve ser maior que zero.");
    error.statusCode = 422;
    throw error;
  }

  return {
    creditor: cleanCreditor,
    amount: parsedAmount,
    months: parsedMonths,
  };
}

export const postFatura = async (req, res, next) => {
  try {
    const { creditor, amount, months } = validateFaturaInput(
      req.body.creditor,
      req.body.amount,
      req.body.months,
    );
    const fatura = new Fatura({
      creditor,
      amount,
      months,
      criador: req.userId,
    });

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
    const faturas = await Fatura.find({ criador: req.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      message: "As faturas foram buscadas com sucesso",
      faturas,
    });
  } catch (error) {
    next(error);
  }
};

export const putFatura = async (req, res, next) => {
  try {
    const { creditor, amount, months } = validateFaturaInput(
      req.body.creditor,
      req.body.amount,
      req.body.months,
    );
    const fatura = await Fatura.findOne({
      _id: req.params.faturaId,
      criador: req.userId,
    });

    if (!fatura) {
      const error = new Error("Fatura não encontrada.");
      error.statusCode = 404;
      throw error;
    }

    fatura.creditor = creditor;
    fatura.amount = amount;
    fatura.months = months;

    await fatura.save();

    res.status(200).json({
      message: "Fatura atualizada com sucesso",
      fatura,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFatura = async (req, res, next) => {
  try {
    const fatura = await Fatura.findOneAndDelete({
      _id: req.params.faturaId,
      criador: req.userId,
    });

    if (!fatura) {
      const error = new Error("Fatura não encontrada.");
      error.statusCode = 404;
      throw error;
    }

    await User.findByIdAndUpdate(req.userId, {
      $pull: { faturas: fatura._id },
    });

    res.status(200).json({
      message: "Fatura excluída com sucesso",
      faturaId: req.params.faturaId,
    });
  } catch (error) {
    next(error);
  }
};
