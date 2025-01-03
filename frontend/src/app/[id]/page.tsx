"use client";

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { useRestaurantContext } from "@/Context/RestaurantCotext";
import BookingSummary from "@/Components/BookingSummary";

interface Restaurant {
  _id: string;
  name: string;
  location: string;
  phone: string;
  email: string;
}

interface UserDetails {
  name: string;
  contact: string;
  numberOfGuests: number;
  dateAndTime: string;
}

interface Slot {
  dateAndTime: string;
}

const Booking = () => {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [slots, setSlots] = useState<Date[]>([]);
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);
  const [restaurantDetails, setRestaurantDetails] = useState<Restaurant | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    numberOfGuests: 2,
  });

  const router = useRouter();
  const { selectedRestaurant } = useRestaurantContext();

  useEffect(() => {
    if (!selectedRestaurant?.name) {
      router.push("/");
    } else {
      setRestaurantDetails(selectedRestaurant);
    }
  }, [selectedRestaurant, router]);

  const restaurantId = usePathname().split("/")[1];

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDateTime(date);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const areDatesEqual = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate() &&
      date1.getHours() === date2.getHours() &&
      date1.getMinutes() === date2.getMinutes()
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDateTime) {
      toast.error("Please fill in all fields.");
      return;
    }

    const checkSlot = slots.some((slot) =>
      areDatesEqual(slot, selectedDateTime)
    );

    if (checkSlot) {
      toast.error(
        "Time slot is already taken. Please choose a different time."
      );
      return;
    }

    try {
      const bookingData = {
        ...formData,
        dateAndTime: selectedDateTime.toISOString(),
        restaurantId,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/booking`,
        bookingData
      );

      if (response.status === 201) {
        setUserDetails(response.data.booking);
        setIsSummaryOpen(true);
        setFormData({
          name: "",
          contact: "",
          numberOfGuests: 2,
        });
        setSelectedDateTime(null);
      } else {
        toast.error("Failed to create booking: " + response.data.message);
      }
    } catch (error) {
      toast.error("Error creating booking");
      console.error(error);
    }
  };

  const minTime = new Date();
  minTime.setHours(10, 0, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(23, 0, 0, 0);

  const checkAvailableSlots = async () => {
    try {
      const response = await axios.get<Slot[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/booking/slots/${restaurantId}`
      );

      if (response.status === 200) {
        const bookedSlots = response.data;
        setSlots(bookedSlots.map((item) => new Date(item.dateAndTime)));
      } else {
        toast.error("Failed to fetch booking slots.");
      }
    } catch (error) {
      toast.error("Error fetching booking slots.");
      console.error(error);
    }
  };

  useEffect(() => {
    checkAvailableSlots();
  }, [restaurantId]);

  return (
    <div className="flex items-center h-screen justify-center bg-gray-200">
      <div className="relative w-full sm:w-[600px] bg-gray-200 border-2 border-zinc-500 rounded-lg shadow-lg p-4 sm:p-6 mx-[10px] sm:mx-0">
        <div className="flex justify-center mb-3">
          <h2 className="text-3xl font-bold">Booking Form</h2>
        </div>

        {isSummaryOpen && restaurantDetails && userDetails && (
          <BookingSummary
            restaurantDetails={restaurantDetails}
            setIsSummaryOpen={setIsSummaryOpen}
            userDetails={userDetails}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg">
            {selectedRestaurant?.name
              ? `Restaurant Name: ${selectedRestaurant.name}`
              : ""}
          </h2>
          <div>
            <label className="block">
              Name:
              <input
                type="text"
                name="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 w-full p-2 rounded bg-gray-300"
              />
            </label>
          </div>
          <div>
            <label className="block">
              Contact:
              <input
                type="text"
                name="contact"
                placeholder="Enter Contact number"
                value={formData.contact}
                onChange={handleInputChange}
                required
                className="mt-1 w-full p-2 rounded bg-gray-300"
              />
            </label>
          </div>
          <div className="flex flex-col">
            Date and Time:
            <DatePicker
              selected={selectedDateTime}
              onChange={handleDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              dateFormat="dd/MM/yyyy HH:mm"
              className="mt-1 w-full sm:w-28  p-2 rounded bg-gray-300"
              required
              minTime={minTime}
              maxTime={maxTime}
              excludeTimes={slots.filter(
                (slot) =>
                  slot.getDate() === selectedDateTime?.getDate() &&
                  slot.getMonth() === selectedDateTime?.getMonth() &&
                  slot.getFullYear() === selectedDateTime?.getFullYear()
              )}
            />
          </div>
          <div>
            <label className="block">
              Number of Guests:
              <input
                type="number"
                name="numberOfGuests"
                value={formData.numberOfGuests}
                onChange={handleInputChange}
                min={1}
                max={20}
                required
                className="mt-1 w-full p-2 rounded bg-gray-300"
              />
            </label>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="my-2 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Booking;
