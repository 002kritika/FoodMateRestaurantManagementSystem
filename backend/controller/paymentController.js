import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const product_code = "EPAYTEST"; // test product code
const secret_key = "8gBm/:&EnhH.1/q"; // test secret key

// INITIATE PAYMENT
export const initiatePayment = async (req, res) => {
  const { address, orderType, cartItems } = req.body;
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ error: "User is not authenticated" });
  }

  let amount = cartItems.reduce(
    (acc, item) => acc + (item.menu.price * item.quantity || 0),
    0
  );

  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "Invalid total amount." });
  }

  const deliveryCharge = 150;
  const totalAmount = amount + deliveryCharge;
  const transaction_uuid = uuidv4();

  const message = `total_amount=${totalAmount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  const hash = CryptoJS.HmacSHA256(message, secret_key);
  const signature = CryptoJS.enc.Base64.stringify(hash);

  const success_url = `http://localhost:5000/api/payment/success?transaction_uuid=${transaction_uuid}&userId=${userId}&address=${encodeURIComponent(
    address
  )}&orderType=${orderType}&totalAmount=${totalAmount}`;
  const failure_url = `http://localhost:5000/api/payment/failure?transaction_uuid=${transaction_uuid}`;

  res.json({
    amount,
    product_delivery_charge: deliveryCharge,
    total_amount: totalAmount,
    transaction_uuid,
    signature,
    success_url,
    failure_url,
    userId,
  });
};

// HANDLE SUCCESS
export const handleSuccess = async (req, res) => {
  try {
    const { transaction_uuid, address, orderType, totalAmount, userId } =
      req.query;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Invalid or missing user ID" });
    }

    const parsedUserId = parseInt(userId);

    const user = await prisma.user.findUnique({ where: { id: parsedUserId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cartItems = await prisma.cart.findMany({
      where: { userId: parsedUserId },
      include: { menu: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const order = await prisma.order.create({
      data: {
        userId: parsedUserId,
        totalAmount: parseFloat(totalAmount),
        paymentMethod: "Esewa",
        address,
        orderType,
        status: "CONFIRMED",
        deliveryCharge: 150,
        items: {
          create: cartItems.map((item) => ({
            menuId: item.menuId,
            quantity: item.quantity,
            price: item.menu.price,
          })),
        },
      },
    });

    await prisma.payment.create({
      data: {
        method: "Esewa",
        transactionUuid: transaction_uuid,
        amount: parseFloat(totalAmount),
        status: "SUCCESS",
        order: {
          connect: { id: order.id },
        },
        user: {
          connect: { id: parsedUserId },
        },
      },
    });

    res.redirect(
      `http://localhost:3000/customer/payment/success?orderId=${order.id}&transaction_uuid=${transaction_uuid}`
    );
  } catch (err) {
    console.error("Error in handleSuccess:", err);
    res.redirect("http://localhost:3000/customer/payment/failure");
  }
};

// HANDLE FAILURE
export const handleFailure = async (req, res) => {
  try {
    const { transaction_uuid } = req.query;

    await prisma.payment.update({
      where: {
        transactionUuid: transaction_uuid,
      },
      data: {
        status: "FAILED",
      },
    });

    res.redirect("http://localhost:3000/customer/payment/failure");
  } catch (err) {
    console.error("Error in handleFailure:", err);
    res.status(500).json({ error: "Failed to handle payment failure" });
  }
};

export const getOrderDetails = async (req, res) => {
  const { transaction_uuid, orderId } = req.query;

  if (!transaction_uuid && !orderId) {
    return res
      .status(400)
      .json({ error: "Missing transaction_uuid or orderId" });
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        ...(orderId ? { id: parseInt(orderId) } : {}),
        ...(transaction_uuid
          ? {
              Payment: {
                some: {
                  transactionUuid: transaction_uuid,
                },
              },
            }
          : {}),
      },
      include: {
        items: {
          include: {
            menu: {
              select: {
                name: true,
                price: true,
                imageUrl: true,
                category: true,
                isPopular: true,
              },
            },
          },
        },
        Payment: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("❌ Failed to fetch order details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
