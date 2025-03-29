import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client"; // Corrected the import

const prisma = new PrismaClient();
dotenv.config(); // Only once in the whole application
// Authentication middleware to check if the user is logged in
const authenticateUser = async (req, res, next) => {
  const token = req.cookies.jwt; // Extract token from cookies

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Verify the JWT token
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    // Check if the refresh token exists in the database and belongs to the correct user
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (refreshToken && payload.id === refreshToken.userId) {
      req.user = { id: payload.id }; // Attach user info to the request object
      return next(); // Proceed to the next middleware/route handler
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (err) {
    console.error("JWT verification failed:", err); // Log the actual error for debugging
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export default authenticateUser;
