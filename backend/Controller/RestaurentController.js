const RestaurantModel = require("../Model/RestaurantModel");


const getRestaurent = async (req, res) => {
  try {
    const Restaurent = await RestaurantModel.find()
    res.status(200).json(Restaurent);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Restaurents", error: error.message });
  }
};


module.exports = { getRestaurent };
