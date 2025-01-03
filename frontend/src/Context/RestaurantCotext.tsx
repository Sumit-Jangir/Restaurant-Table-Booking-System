"use client";

import React, { createContext, useContext, useState } from "react";


interface Restaurant {
  _id: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  image: string;
}

interface RestaurantContextType {
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
}

const RestaurantContext = createContext<RestaurantContextType | null>(null);

export const useRestaurantContext = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error("useRestaurantContext must be used within a RestaurantProvider");
  }
  return context;
};

export const RestaurantContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  return (
    <RestaurantContext.Provider value={{ selectedRestaurant, setSelectedRestaurant }}>
      {children}
    </RestaurantContext.Provider>
  );
};
