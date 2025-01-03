"use client";

import React from "react";

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

interface BookingSummaryProps {
  restaurantDetails: Restaurant;
  userDetails: UserDetails;
  setIsSummaryOpen: (isOpen: boolean) => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  restaurantDetails,
  userDetails,
  setIsSummaryOpen,
}) => {
  const handleClose = () => setIsSummaryOpen(false);

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Booking Summary</h2>
        <p><strong>Restaurant Name:</strong> {restaurantDetails.name}</p>
        <p><strong>Location:</strong> {restaurantDetails.location}</p>
        <p><strong>Phone:</strong> {restaurantDetails.phone}</p>
        <p><strong>User Name:</strong> {userDetails.name}</p>
        <p><strong>Contact:</strong> {userDetails.contact}</p>
        <p><strong>Number of Guests:</strong> {userDetails.numberOfGuests}</p>
        <p><strong>Date and Time:</strong> {new Date(userDetails.dateAndTime).toLocaleString()}</p>
        <button
          onClick={handleClose}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;
