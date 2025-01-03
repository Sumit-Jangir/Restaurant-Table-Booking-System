import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import toast from "react-hot-toast";

interface BookingProps {
  setIsBookingOpen: React.Dispatch<React.SetStateAction<boolean>>;
  restaurantId: string;
}

interface Slot {
  dateAndTime: string;
}

const Booking: React.FC<BookingProps> = ({
  setIsBookingOpen,
  restaurantId,
}) => {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null); // Separate state for time
  const [slots, setSlots] = useState<Date[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    numberOfGuests: 1,
  });

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDateTime(new Date(date));
      if (selectedTime) {
        setSelectedDateTime(
          new Date(
            date.setHours(selectedTime.getHours(), selectedTime.getMinutes())
          )
        );
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
      alert("Please fill in all fields.");
      return;
    }
    const checkSlot = slots.some((slot) =>
      areDatesEqual(slot, selectedDateTime)
    );
    if (checkSlot) {
      toast.error("Time slot is already taken. Please choose a different time.");
      return;
    }

    try {
      const bookingData = {
        ...formData,
        dateAndTime: selectedDateTime,
        restaurantId,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/booking`,
        bookingData
      );
      if (response.status === 201) {
        alert(response.data.message);
        setIsBookingOpen(false);
      } else {
        alert("Failed to create booking: " + response.data.message);
      }
    } catch (error) {
      alert("Error creating booking");
      console.error(error);
    }
  };

  const minTime = new Date();
  minTime.setHours(10, 0, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(23, 0, 0, 0); 

  const checkAvailableSlots = async (): Promise<void> => {
    try {
      const response = await axios.get<Slot[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/booking/slots/${restaurantId}`
      );

      if (response.status === 200) {
        const bookedSlots = response.data;
        setSlots(bookedSlots.map((item) => new Date(item.dateAndTime)));
      } else {
        alert("Failed to fetch booking slots: " + response.data);
      }
    } catch (error) {
      alert("Error fetching booking slots");
      console.error(error);
    }
  };

  useEffect(() => {
    checkAvailableSlots();
  }, [selectedDateTime]);


  return (
    <div
      className="fixed z-[100] inset-0 h-auto flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setIsBookingOpen(false)}
    >
      <div
        className="relative w-full sm:w-[600px] bg-[#aeaeae] rounded-lg shadow-lg p-4 sm:p-6 mx-4 sm:mx-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between mb-3">
          <h2 className="text-2xl">Booking Form</h2>
          <span
            className="text-gray-700 hover:text-gray-800 cursor-pointer text-4xl font-bold"
            onClick={() => setIsBookingOpen(false)}
          >
            &times;
          </span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="mt-1 w-full p-2 rounded bg-gray-300"
              required
              minTime={minTime} // Set min time to 10:00 AM
              maxTime={maxTime} // Set max time to 11:00 PM
              excludeTimes={slots.filter(
                (slot) =>
                  slot.getDate() === selectedDateTime?.getDate() &&
                  slot.getMonth() === selectedDateTime?.getMonth() &&
                  slot.getFullYear() === selectedDateTime?.getFullYear()
              )}
              onChangeRaw={(e) => {}}
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
