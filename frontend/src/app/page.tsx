"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRestaurantContext } from "@/Context/RestaurantCotext";

interface Restaurant {
  _id: string;
  name: string;
  location: string;
  phone: string;
  image: string;
  email: string;
}

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const { setSelectedRestaurant } = useRestaurantContext();
  const router = useRouter();

  const getRestaurants = useCallback(async () => {
    try {
      const response = await axios.get<Restaurant[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/restaurent`
      );

      if (response.status === 200) {
        setRestaurants(response.data);
      }
      console.log("API Response:", response);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  }, []);

  useEffect(() => {
    getRestaurants();
  }, [getRestaurants]);

  const handleBooking = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    router.push(restaurant._id);
  };

  return (
    <div className="flex flex-wrap justify-evenly max-w-[1160px] mx-auto m-3 p-4 gap-7">
      {restaurants.map((item) => (
        <div key={item._id}>
          <div className="bg-gray-200 rounded-lg">
            <Image
              className="rounded-lg"
              src={item.image}
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
                onClick={() => handleBooking(item)}
                className="my-2 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Book Table
              </button>
              <p className="text-sm text-gray-600">{item.location}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
