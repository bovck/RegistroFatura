import Fatura from "../models/fatura.js";
export const postFatura = async (req, res, next) => {
  const creditor = req.body.creditor;
  const amount = req.body.amount;
  const month = req.body.months;
  const items = { creditor, amount, month };
  console.log(creditor, amount, month, "estou no controllers/fatura");

  res.json({ message: "tudo normal" });
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
