const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  contact: {
    type: String,
    required: true,
    trim: true,
  },
  dateAndTime: {
    type: Date,
    required: true,
  },
  // time: {
  //   type: String,
  //   required: true,
  // },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  // tableNumber: {
  //   type: Number,
  //   required: false, 
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
