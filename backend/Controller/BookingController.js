const BookingModel = require("../Model/BookingModel");

const createBooking = async (req, res) => {
  try {
    const { name, contact, dateAndTime, numberOfGuests, restaurantId } = req.body;

    // Ensure the required fields are provided in the request
    if (!name || !contact || !dateAndTime || !numberOfGuests || !restaurantId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create new booking instance
    const booking = new BookingModel({
      name,
      contact,
      dateAndTime,
      numberOfGuests,
      restaurant: restaurantId,
    });

    // Save the booking to the database
    await booking.save();

    // Return success response
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.find().populate("restaurant");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

const getBookingsSlots = async (req, res) => {
  try {
    const {id} = req.params;
    console.log(id)
    const bookings = await BookingModel.find({restaurant:id})
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching slots", error: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await BookingModel.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking", error: error.message });
  }
};

module.exports = { createBooking, getBookings, deleteBooking, getBookingsSlots };
