import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

interface Restaurant {
  name: string;
  location: string;
  phone: string;
  email: string;
}

interface User {
  _id: string;
  name: string;
  contact: string;
  dateAndTime: Date;
  numberOfGuests: number;
}

interface BookingProps {
  setIsSummaryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  restaurantDetails: Restaurant;
  userDetails: User;
}

const BookingSummary: React.FC<BookingProps> = ({
  setIsSummaryOpen,
  restaurantDetails,
  userDetails,
}) => {
  const router = useRouter();

  const handleDone = () => {
    setIsSummaryOpen(false);
    router.push("/");
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/booking/${userDetails._id}`
      );
      if (response.status === 200) {
        toast.success("Booking deleted successfully!");
        setIsSummaryOpen(false);
        router.push("/");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete the booking.");
    }
  };

  return (
    <div className="fixed z-[100] inset-0 h-auto flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full sm:w-[400px] border-4 border-zinc-800 bg-[#aeaeae] rounded-lg shadow-lg mx-4 sm:mx-0">
        {/* User Details */}
        <div className="bg-gray-300 p-4 rounded-lg shadow-md">
          <div className="pr-4 text-right">
            <button
            onClick={handleDelete}
              className="absolute top-4 right-4 py-1 px-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
          <h3 className="text-xl font-semibold">Restaurant Details</h3>
          <p>
            <strong>Name:</strong> {restaurantDetails?.name}
          </p>
          <p>
            <strong>Location:</strong> {restaurantDetails?.location}
          </p>
          <p>
            <strong>Email:</strong> {restaurantDetails?.email}
          </p>
          <p>
            <strong>Phone:</strong> {restaurantDetails?.phone}
          </p>

          <h3 className="text-xl font-semibold mt-3">User Details</h3>
          <p>
            <strong>Name:</strong> {userDetails.name}
          </p>
          <p>
            <strong>Contact:</strong> {userDetails.contact}
          </p>
          <p>
            <strong>Date & Time:</strong>{" "}
            {new Date(userDetails.dateAndTime).toLocaleString()}
          </p>
          <p>
            <strong>Guests:</strong> {userDetails.numberOfGuests}
          </p>
          <div className=" text-right">
            <button
              onClick={handleDone}
              className=" py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
