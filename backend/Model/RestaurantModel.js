const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  tables: [
    {
      tableNumber: {
        type: Number,
        required: true,
      },
      seats: {
        type: Number,
        required: true,
      },
      available: {
        type: Boolean,
        default: true,
      },
    },
  ],
  image:{
    type:String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
