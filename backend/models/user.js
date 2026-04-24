import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  nome: {
    type: String,
    required: true,
  },
  sobrenome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  senha: {
    type: String,
    required: true,
  },
  faturas: [
    {
      type: Schema.Types.ObjectId,
      ref: "Fatura",
    },
  ],
});

const User = mongoose.model("User", userSchema);
export default User;
