"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

type WeatherData = {
  temperature: number;
  description: string;
  icon: string;
  city: string;
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get user's location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Fetch weather data
          const apiKey = "b35d864ce8e20e1668e4570541a3a21f"; // Replace with your OpenWeatherMap API key
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
          );

          const data = response.data;

          setWeather({
            temperature: data.main.temp,
            description: data.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            city: data.name,
          });
        } catch (error) {
          setError("Unable to fetch weather data. Please try again later.");
        }
      },
      () => {
        setError("Unable to access your location.");
      }
    );
  }, []);

  if (error) {
    return <div className="p-4 bg-red-100 text-red-500">{error}</div>;
  }

  if (!weather) {
    return <div className="p-4 text-gray-500">Loading weather...</div>;
  }

  return (
    <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-2">{weather.city}</h2>
      <img src={weather.icon} alt={weather.description} className="w-16 h-16" />
      <p className="text-lg font-medium">{weather.temperature}°C</p>
      <p className="text-gray-500 capitalize">{weather.description}</p>
    </div>
  );
}
