import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";

const prisma = new PrismaClient();

const availableTimeSlots = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

const convertToNepalDate = (date) => {
  return DateTime.fromJSDate(date, { zone: "Asia/Kathmandu" }).toISODate();
};

const isAvailableTimeSlot = async (reservationDate, requestedTime) => {
  const dateString = convertToNepalDate(reservationDate);

  const existingReservation = await prisma.reservation.findFirst({
    where: {
      date: dateString,
      time: requestedTime,
    },
  });

  return !existingReservation;
};

const sendConfirmationEmail = async (name, email, reservationDetails) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Reservation Confirmed Successfully",
      html: `
        <h1>Reservation Confirmed</h1>
        <p>Dear ${name},</p>
        <p>Your reservation has been successfully made with the following details:</p>
        <ul>
          <li>Date: ${reservationDetails.date}</li>
          <li>Time: ${reservationDetails.time}</li>
          <li>Service: ${reservationDetails.service}</li>
        </ul>
        <p>Thank you for choosing us!</p>
        <p>Best regards,<br>Beauty Galore Salon</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
};

const createReservation = async (req, res) => {
  try {
    const { name, email, phone, date, service, timeSlot } = req.body;
    const userId = req.user?.id;

    if (!availableTimeSlots.includes(timeSlot)) {
      return res
        .status(400)
        .json({ error: "Invalid time slot. Please choose a valid time." });
    }

    if (
      !name ||
      !email ||
      !phone ||
      !date ||
      !service ||
      !timeSlot ||
      !userId
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const reservationDate = DateTime.fromISO(date, {
      zone: "Asia/Kathmandu",
    }).startOf("day");
    const todayNepal = DateTime.now().setZone("Asia/Kathmandu").startOf("day");

    if (reservationDate < todayNepal) {
      return res.status(400).json({
        error: "You cannot book a reservation for a past date.",
      });
    }

    const isAvailable = await isAvailableTimeSlot(
      reservationDate.toJSDate(),
      timeSlot
    );

    if (!isAvailable) {
      return res.status(400).json({
        error: "Reservation time is not available.",
        suggestion: "Please choose a different time.",
      });
    }

    const reservation = await prisma.reservation.create({
      data: {
        name,
        email,
        phone,
        date: reservationDate.toISODate(),
        time: timeSlot,
        service,
        userId,
        status: "Pending",
      },
    });

    await sendConfirmationEmail(name, email, {
      date: reservationDate.toISODate(),
      time: timeSlot,
      service,
    });

    res
      .status(201)
      .json({ message: "Reservation booked successfully!", reservation });
  } catch (error) {
    console.error("❌ Error creating reservation:", error);
    res
      .status(500)
      .json({ error: "Failed to book reservation", details: error.message });
  }
};

const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const reservation = await prisma.reservation.findUnique({
      where: { id: Number(id) },
    });

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    if (reservation.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You can only cancel your own reservations" });
    }

    if (reservation.status !== "Pending") {
      return res
        .status(400)
        .json({ error: "Only pending reservations can be cancelled" });
    }

    const createdAt = DateTime.fromJSDate(reservation.createdAt);
    const now = DateTime.local();
    const hoursSinceBooking = now.diff(createdAt).as("hours");

    if (hoursSinceBooking > 2) {
      return res.status(400).json({
        error: "You can only cancel reservations within 2 hours of booking",
      });
    }

    await prisma.reservation.update({
      where: { id: Number(id) },
      data: { status: "Cancelled" },
    });

    return res
      .status(200)
      .json({ message: "Reservation canceled successfully" });
  } catch (error) {
    console.error("Cancel error:", error);
    return res.status(500).json({ error: "Failed to cancel reservation" });
  }
};

const getUserReservations = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: "User not authenticated" });
    }

    const reservations = await prisma.reservation.findMany({
      where: { userId },
    });

    if (reservations.length === 0) {
      return res.status(404).json({ error: "No reservations found" });
    }

    res.status(200).json({ reservations });
  } catch (error) {
    console.error("❌ Error fetching reservations:", error);
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
};

const getAllUserReservations = async (req, res) => {
  try {
    if (!req.adminId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const reservations = await prisma.reservation.findMany();

    if (reservations.length === 0) {
      return res.status(404).json({ error: "No reservations found" });
    }

    res.status(200).json({ reservations });
  } catch (error) {
    console.error("❌ Error fetching reservations:", error);
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
};

const confirmReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.adminId;

    if (!adminId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: Number(id) },
    });

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    if (reservation.status !== "Pending") {
      return res
        .status(400)
        .json({ error: "Only pending reservations can be confirmed" });
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: Number(id) },
      data: { status: "Confirmed" },
    });

    return res.status(200).json({
      message: "Reservation confirmed successfully",
      reservation: updatedReservation,
    });
  } catch (error) {
    console.error("Confirm error:", error);
    return res.status(500).json({ error: "Failed to confirm reservation" });
  }
};

export {
  createReservation,
  cancelReservation,
  getUserReservations,
  getAllUserReservations,
  confirmReservation,
};
