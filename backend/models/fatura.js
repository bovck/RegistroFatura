import mongoose from "mongoose";
const { Schema } = mongoose;

const faturaSchema = new Schema({
  creditor: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  month: {
    type: Date,
    required: true,
  },
});

const Fatura = mongoose.model("Fatura", faturaSchema);
export default Fatura;
