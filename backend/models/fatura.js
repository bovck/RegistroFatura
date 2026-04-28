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
  months: {
    type: Number,
    required: true,
    min: 1,
  },
  criador: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

const Fatura = mongoose.model("Fatura", faturaSchema);
export default Fatura;
