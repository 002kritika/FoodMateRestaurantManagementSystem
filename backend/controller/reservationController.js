import { PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";

const prisma = new PrismaClient();

// Available time slots (24-hour format in Nepal Time)
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

// Convert UTC time to Nepal Time (Asia/Kathmandu)
const convertToNepalDate = (date) => {
  return DateTime.fromJSDate(date, { zone: "Asia/Kathmandu" }).toISODate(); // return as YYYY-MM-DD
};

// Helper function to check if the requested time slot is available
const isAvailableTimeSlot = async (reservationDate, requestedTime) => {
  const timeString = requestedTime;
  console.log("🕒 Checking availability for:", timeString);

  // Convert date to string in format YYYY-MM-DD
  const dateString = convertToNepalDate(reservationDate);

  // Check if the requested time slot already exists in the database for the same date
  const existingReservation = await prisma.reservation.findFirst({
    where: {
      date: dateString, // Compare the date as a string
      time: timeString,
    },
  });

  return !existingReservation;
};

// ✅ Create Reservation (requires authentication)
const createReservation = async (req, res) => {
  try {
    const { name, email, phone, date, service, timeSlot } = req.body;
    const userId = req.user?.id;

    // Validate that the timeSlot is within the available time slots
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

    // Check for past date
    if (reservationDate < todayNepal) {
      return res.status(400).json({
        error: "You cannot book a reservation for a past date.",
      });
    }

    const requestedTime = timeSlot;

    // Check if the requested time slot is available
    const isAvailable = await isAvailableTimeSlot(
      reservationDate.toJSDate(),
      requestedTime
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
        date: reservationDate.toISODate(), // Store in YYYY-MM-DD
        time: requestedTime,
        service,
        userId,
        status: "Pending", // Default status
      },
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

// ✅ Cancel Reservation (requires authentication)
// ✅ Cancel Reservation (within 2 hours of booking)

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

    const createdAt = DateTime.fromJSDate(reservation.createdAt);
    const now = DateTime.local();
    const hoursSinceBooking = now.diff(createdAt).as("hours");

    if (hoursSinceBooking > 2) {
      return res.status(400).json({
        error: "You can only cancel reservations within 2 hours of booking",
      });
    }

    // Update status to "Cancelled" instead of deleting the reservation
    await prisma.reservation.update({
      where: { id: Number(id) },
      data: { status: "Cancelled" }, // Change status instead of deletion
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
    console.log("userID", userId);
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
    const adminId = req.adminId; // Admin's ID from the request

    if (!adminId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: Number(id) },
    });

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // Check if the status is "Pending"
    if (reservation.status !== "Pending") {
      return res
        .status(400)
        .json({ error: "Only pending reservations can be confirmed" });
    }

    // Update the status to "Confirmed"
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
