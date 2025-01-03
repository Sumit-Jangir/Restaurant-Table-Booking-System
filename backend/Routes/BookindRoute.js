const express = require("express");
const { createBooking, getBookings, deleteBooking, getBookingsSlots } = require("../Controller/BookingController");

const router = express.Router();

router.post("/", createBooking);
router.get("/", getBookings);
router.get("/slots/:id", getBookingsSlots);
router.delete("/:id", deleteBooking);

module.exports = router;
