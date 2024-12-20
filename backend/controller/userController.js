// import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const customerLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ user }, "casdkjfqheiru23", { expiresIn: "1h" });
    return res
      .status(200)
      .json({ message: "User logged in successfully", user, token });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "User not found", error: error.message });
  }
};

const customerRegister = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "please fill all field" });
  }

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "user not created" });
    }
    return res.status(201).json({ message: "user created successfully", user });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "user not created", error: error.message });
  }
};

const staffLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ user }, "casdkjfqheiru23", { expiresIn: "1h" });
    return res
      .status(200)
      .json({ message: "User logged in successfully", user, token });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "User not found", error: error.message });
  }
};

const staffRegister = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "please fill all field" });
  }

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: "STAFF",
      },
    });
    if (!user) {
      return res.status(400).json({ message: "staff not created" });
    }
    return res
      .status(201)
      .json({ message: "staff created successfully", user });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "staff not created", error: error.message });
  }
};
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ admin }, "casdkjfqheiru23", { expiresIn: "1h" });
    return res
      .status(200)
      .json({ message: "User logged in successfully", user, token });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "User not found", error: error.message });
  }
};

const adminRegister = async (req, res) => {
  
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "please fill all field" });
    }

    try {
      const user = await prisma.admin.create({
        data: {
          name,
          email,
          password,
          role: "STAFF",
        },
      });
      if (!user) {
        return res.status(400).json({ message: "staff not created" });
      }
      return res
        .status(201)
        .json({ message: "staff created successfully", user });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "staff not created", error: error.message });
    }
  };
  

export {
  customerLogin,
  customerRegister,
  staffLogin,
  staffRegister,
  adminLogin,
  adminRegister,
};
