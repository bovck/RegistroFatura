import Fatura from "../models/fatura.js";
export const postFatura = async (req, res, next) => {
  const creditor = req.body.creditor;
  const amount = req.body.amount;
  const month = req.body.month;
  console.log(creditor, amount, month);

  res.json({ message: "tudo normal" });
};
