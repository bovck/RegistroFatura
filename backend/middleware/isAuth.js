import jwt from "jsonwebtoken";
export default async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Não autorizado");
    error.statusCode = 500;
    throw error;
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, "secret");
  } catch (error) {
    error.statusCode = 500;
  }

  if (!decodedToken) {
    const error = new Error("Não autorizado");
    error.statusCode = 500;
    throw error;
  }

  req.userId = decodedToken.userId;
  next();
};
