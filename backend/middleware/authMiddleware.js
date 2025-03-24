import jwt from "jsonwebtoken";

export const authenticateAdmin = (req, res, next) => {
  // Check for token in cookies first
  const token =
    req.cookies?.jwt || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};
