"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Booking from "@/Components/Booking";

interface Table {
  tableNumber: number;
  seats: number;
  available: boolean;
}

interface Restaurant {
  _id: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  tables: Table[];
  image: string;
}

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);

  const getRestaurants = async (): Promise<void> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/restaurent`
      );

      if (response.status === 200) {
        setRestaurants(response.data);
      }
      console.log("API Response:", response);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  const handleBooking = (restaurantId: string) => {
    setBookingId(restaurantId);
    setIsBookingOpen(true);
  };

  return (
    <div className="flex flex-wrap justify-evenly max-w-[1160px] mx-auto m-3 p-4 gap-7 ">
      {restaurants.map((item, index) => (
        <div key={index}>
          <div key={index} className="bg-gray-200 rounded-lg  ">
            <Image
              className="rounded-lg  "
              src={item?.image}
              alt="Restaurant Image"
              width={255}
              height={100}
              priority
            />
            <div className="p-4 pt-2">
              <h2 className="text-lg font-semibold text-black truncate">
                {item.name}
              </h2>
              <button
                onClick={() => handleBooking(item._id)}
                className="my-2 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Book Table
              </button>
              <p className="text-sm text-gray-600">
                {item.location}, Jaipur Rajasthan
              </p>
            </div>
          </div>
          {isBookingOpen && bookingId === item._id && (
            <Booking
              setIsBookingOpen={setIsBookingOpen}
              restaurantId={item._id}
              // restaurants={restaurants.map(({ _id, name }) => ({ _id, name }))} 
            />
          )}
        </div>
      ))}
    </div>
  );
}
