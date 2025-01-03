const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const BookingRoute = require("./Routes/BookindRoute")
const RestaurantRoute = require("./Routes/RestaurantRoute")
// const RestaurantModel = require("./Model/RestaurantModel");
// const BookingModel = require("./Model/BookingModel");

require("./config/db");
require("dotenv").config();

app.use(bodyParser.json());
app.use(cors());

app.use('/booking', BookingRoute);
app.use('/restaurent', RestaurantRoute);



const PORT = process.env.PORT || 7070;

app.get("/ping", (req, res) => {
    res.send("Pong");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});






// const createRestaurant = async () => {
//   try {
//     const restaurant = new RestaurantModel({
//       name: "Delicious Eats",
//       location: "123 Flavor Street",
//       phone: "+1234567890",
//       email: "info@deliciouseats.com",
//       tables: [
//         { tableNumber: 1, seats: 4 },
//         { tableNumber: 2, seats: 2 },
//         { tableNumber: 3, seats: 6 },
//       ],
//     });
//     await restaurant.save(); // Save the restaurant instance
//     console.log("Restaurant created:", restaurant);
//     return restaurant;
//   } catch (error) {
//     console.error("Error creating restaurant:", error.message);
//     throw error;
//   }
// };

// const createBooking = async (restaurantId) => {
//   try {
//     const booking = new BookingModel({
//       name: "John Doe",
//       contact: "+9876543210",
//       date: new Date("2025-01-15"),
//       time: "18:00",
//       numberOfGuests: 4,
//       restaurant: restaurantId,
//       tableNumber: 1,
//     });
//     await booking.save(); // Save the booking instance
//     console.log("Booking created:", booking);
//   } catch (error) {
//     console.error("Error creating booking:", error.message);
//     throw error;
//   }
// };

// (async () => {
//   try {
//     const restaurant = await createRestaurant();
//     await createBooking(restaurant._id);
//     console.log("Setup completed successfully!");
//     mongoose.connection.close(); // Close the connection after execution
//   } catch (error) {
//     console.error("Error during setup:", error.message);
//     mongoose.connection.close();
//   }
// })();