// Type definitions
interface WeatherConfig {
  geocodeApiUrl: string;
  weatherApiUrl: string;
  defaultCity: string;
  loadingDelay: number;
}

interface BookSuggestions {
  [key: string]: string;
}

interface WeatherRecommendation {
  id: number;
  weatherCondition: string;
  bookTitle: string;
  genres: string[];
  reason: string;
}

interface WeatherBookSuggestion {
  weather: string;
  suggestion: string;
  genres: string;
  fullDisplay: string;
}

interface WeatherInfo {
  icon: string;
  condition: string;
  suggestion: string;
  genres: string[];
}

interface LocationData {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
}

interface WeatherData {
  location: string;
  coordinates: LocationData;
  current: {
    temperature: number;
    weathercode: number;
    windspeed: number;
    time: string;
  };
  daily?: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

interface WeatherElements {
  icon: HTMLElement | null;
  condition: HTMLElement | null;
  temp: HTMLElement | null;
  suggestion: HTMLElement | null;
  genres: HTMLElement | null;
  book: HTMLElement | null;
}

const WEATHER_CONFIG: WeatherConfig = {
  geocodeApiUrl: "https://geocoding-api.open-meteo.com/v1/search",
  weatherApiUrl: "https://api.open-meteo.com/v1/forecast",
  defaultCity: "London",
  loadingDelay: 800,
};

const BOOK_SUGGESTIONS: BookSuggestions = {
  "Clear Sky": "Sophie's World by Jostein Gaarder",
  Cloudy: "The Curious Incident of the Dog in the Night-Time by Mark Haddon",
  Rain: "The Master and Margarita by Mikhail Bulgakov",
  Snow: "The Alchemist by Paulo Coelho",
  Thunderstorm: "The Metamorphosis by Franz Kafka",
};

const WEATHER_BOOK_RECOMMENDATIONS: WeatherRecommendation[] = [
  {
    id: 1,
    weatherCondition: "Clear Sky",
    bookTitle: "Sophie's World by Jostein Gaarder",
    genres: ["Adventure", "Travel", "Biography"],
    reason: "Perfect weather for outdoor reading themes",
  },
  {
    id: 2,
    weatherCondition: "Cloudy",
    bookTitle:
      "The Curious Incident of the Dog in the Night-Time by Mark Haddon",
    genres: ["Fiction", "Mystery", "Philosophy"],
    reason: "Great for cozy indoor atmosphere",
  },
  {
    id: 3,
    weatherCondition: "Rain",
    bookTitle: "The Master and Margarita by Mikhail Bulgakov",
    genres: ["Classic", "Drama", "Romance"],
    reason: "Perfect for staying indoors with drama",
  },
  {
    id: 4,
    weatherCondition: "Snow",
    bookTitle: "The Alchemist by Paulo Coelho",
    genres: ["Fantasy", "Winter Tales", "Cozy Mystery"],
    reason: "Winter tales for snowy weather",
  },
  {
    id: 5,
    weatherCondition: "Thunderstorm",
    bookTitle: "The Metamorphosis by Franz Kafka",
    genres: ["Thriller", "Horror", "Suspense"],
    reason: "Suspenseful reading for thunderstorms",
  },
];

function getWeatherBookSuggestions(
  recommendations: WeatherRecommendation[],
): WeatherBookSuggestion[] {
  return recommendations.map((rec) => {
    const weatherIcons: { [key: string]: string } = {
      "Clear Sky": "☀️",
      Cloudy: "☁️",
      Rain: "🌧️",
      Snow: "❄️",
      Thunderstorm: "⛈️",
    };
    return {
      weather: rec.weatherCondition,
      suggestion: `${weatherIcons[rec.weatherCondition]} ${rec.bookTitle}`,
      genres: rec.genres.join(", "),
      fullDisplay: `${weatherIcons[rec.weatherCondition]} ${rec.reason}: ${rec.bookTitle}`,
    };
  });
}

function getBooksForWeather(
  recommendations: WeatherRecommendation[],
  weatherCondition: string,
): WeatherRecommendation[] {
  return recommendations.filter((rec) => {
    return rec.weatherCondition === weatherCondition;
  });
}

function validateCityName(
  cityName: string,
  callback: (isValid: boolean, message?: string) => void,
): void {
  setTimeout(() => {
    if (!cityName || cityName.trim().length === 0) {
      callback(false, "City name cannot be empty");
      return;
    }

    if (cityName.trim().length < 2) {
      callback(false, "City name must be at least 2 characters");
      return;
    }

    callback(true);
  }, 100);
}

function getCityCoordinates(cityName: string): Promise<LocationData> {
  const geocodeUrl = `${WEATHER_CONFIG.geocodeApiUrl}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;

  return fetch(geocodeUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (!data.results || data.results.length === 0) {
        throw new Error(`City "${cityName}" not found`);
      }
      return data.results[0];
    })
    .catch((error) => {
      console.error("Geocoding error:", error);
      throw error;
    });
}

function getWeatherData(location: LocationData): Promise<WeatherData> {
  const weatherUrl = `${WEATHER_CONFIG.weatherApiUrl}?latitude=${location.latitude}&longitude=${location.longitude}&daily=temperature_2m_max,temperature_2m_min&current_weather=true`;

  return fetch(weatherUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Weather API failed: ${response.status}`);
      }
      return response.json();
    })
    .then((weatherData) => {
      return {
        location: `${location.name}, ${location.country}`,
        coordinates: location,
        current: weatherData.current_weather,
        daily: weatherData.daily,
      };
    })
    .catch((error) => {
      console.error("Weather API error:", error);
      throw error;
    });
}

function getWeather(cityName: string): Promise<WeatherData> {
  return getCityCoordinates(cityName)
    .then((location) => {
      return getWeatherData(location);
    })
    .then((weatherData) => {
      console.log("Weather data fetched successfully with promises");
      return weatherData;
    })
    .catch((error) => {
      console.error("Promise chain error:", error);
      throw error;
    });
}

function getWeatherInfo(weatherCode: number): WeatherInfo {
  // Clear Sky: 0-1
  if (weatherCode >= 0 && weatherCode <= 1) {
    return {
      icon: "☀️",
      condition: "Clear Sky",
      suggestion: "Perfect reading weather!",
      genres: ["Adventure", "Travel", "Biography"],
    };
  }

  // Cloudy: 2-3, 45-48 (includes fog)
  if (
    (weatherCode >= 2 && weatherCode <= 3) ||
    (weatherCode >= 45 && weatherCode <= 48)
  ) {
    return {
      icon: "☁️",
      condition: "Cloudy",
      suggestion: "Perfect for cozy reading",
      genres: ["Fiction", "Mystery", "Philosophy"],
    };
  }

  // Rain: 51-67, 80-82
  if (
    (weatherCode >= 51 && weatherCode <= 67) ||
    (weatherCode >= 80 && weatherCode <= 82)
  ) {
    return {
      icon: "🌧️",
      condition: "Rain",
      suggestion: "Stay inside with a good book",
      genres: ["Classic", "Drama", "Romance"],
    };
  }

  // Snow: 71-77, 85-86
  if (
    (weatherCode >= 71 && weatherCode <= 77) ||
    (weatherCode >= 85 && weatherCode <= 86)
  ) {
    return {
      icon: "❄️",
      condition: "Snow",
      suggestion: "Winter reading time",
      genres: ["Fantasy", "Winter Tales", "Cozy Mystery"],
    };
  }

  // Thunderstorm: 95-99
  if (weatherCode >= 95 && weatherCode <= 99) {
    return {
      icon: "⛈️",
      condition: "Thunderstorm",
      suggestion: "Stormy night reading",
      genres: ["Thriller", "Horror", "Suspense"],
    };
  }

  // Default fallback
  return {
    icon: "🌤️",
    condition: "Clear Sky",
    suggestion: "Any weather is good for reading!",
    genres: ["Fiction", "Non-Fiction", "Biography"],
  };
}

async function getWeatherByCity(cityName: string): Promise<WeatherData> {
  if (!cityName || !cityName.trim()) {
    throw new Error("City name cannot be empty");
  }

  try {
    // Step 1: Get coordinates from geocoding API
    const geocodeUrl = `${WEATHER_CONFIG.geocodeApiUrl}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    const geocodeResponse = await fetch(geocodeUrl);

    if (!geocodeResponse.ok) {
      throw new Error(
        `Geocoding failed: ${geocodeResponse.status} ${geocodeResponse.statusText}`,
      );
    }

    const geocodeData = await geocodeResponse.json();

    if (!geocodeData.results || geocodeData.results.length === 0) {
      throw new Error(
        `City "${cityName}" not found. Please check the spelling and try again.`,
      );
    }

    const location = geocodeData.results[0];
    console.log(`Found location: ${location.name}, ${location.country}`);

    // Step 2: Get weather data using coordinates
    const weatherUrl = `${WEATHER_CONFIG.weatherApiUrl}?latitude=${location.latitude}&longitude=${location.longitude}&daily=temperature_2m_max,temperature_2m_min&current_weather=true`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error(
        `Weather API failed: ${weatherResponse.status} ${weatherResponse.statusText}`,
      );
    }

    const weatherData = await weatherResponse.json();

    return {
      location: `${location.name}, ${location.country}`,
      coordinates: {
        latitude: location.latitude,
        longitude: location.longitude,
        name: location.name,
        country: location.country,
      },
      current: weatherData.current_weather,
      daily: weatherData.daily,
    };
  } catch (error) {
    console.error("Weather API Error:", (error as Error).message);
    throw error;
  }
}

function getWeatherElements(): WeatherElements {
  return {
    icon: document.querySelector('[data-weather="icon"]'),
    condition: document.querySelector('[data-weather="condition"]'),
    temp: document.querySelector('[data-weather="temp"]'),
    suggestion: document.querySelector('[data-weather="suggestion"]'),
    genres: document.querySelector('[data-weather="genres"]'),
    book: document.querySelector('[data-weather="book"] span'),
  };
}

function updateWeatherDisplay(weatherData: WeatherData): void {
  const weatherInfo = getWeatherInfo(weatherData.current.weathercode);
  const elements = getWeatherElements();

  // Update basic weather info
  if (elements.icon) elements.icon.textContent = weatherInfo.icon;
  if (elements.condition)
    elements.condition.textContent = `${weatherInfo.condition} in ${weatherData.location}`;
  if (elements.temp)
    elements.temp.textContent = `${Math.round(weatherData.current.temperature)}°C`;
  if (elements.suggestion)
    elements.suggestion.textContent = weatherInfo.suggestion;

  // Update genre tags using map()
  if (elements.genres) {
    elements.genres.innerHTML = "";
    const genreElements = weatherInfo.genres.map((genre) => {
      const genreTag = document.createElement("span");
      genreTag.className = "genre-tag";
      genreTag.textContent = genre;
      return genreTag;
    });

    genreElements.forEach((element) => {
      return elements.genres.appendChild(element);
    });
  }

  // Update book suggestion
  const bookSuggestion =
    BOOK_SUGGESTIONS[weatherInfo.condition] || "A great book for any weather!";
  if (elements.book) elements.book.textContent = bookSuggestion;

  logWeatherBookAnalysis(weatherInfo.condition);
}

function logWeatherBookAnalysis(currentWeather: string): void {
  console.log("=== Weather Book Recommendation Analysis ===");

  // Using filter() to get books for current weather
  const currentWeatherBooks = getBooksForWeather(
    WEATHER_BOOK_RECOMMENDATIONS,
    currentWeather,
  );

  // Using map() to transform book recommendation data
  const weatherSuggestions = getWeatherBookSuggestions(
    WEATHER_BOOK_RECOMMENDATIONS,
  );

  console.log(`Books for ${currentWeather}:`, currentWeatherBooks);
  console.log("All Weather Book Suggestions:", weatherSuggestions);
}

function showLoadingState(): void {
  const elements = getWeatherElements();

  if (elements.condition) elements.condition.textContent = "Loading weather...";
  if (elements.suggestion)
    elements.suggestion.textContent = "Getting your reading suggestions...";
  if (elements.temp) elements.temp.textContent = "--°C";
  if (elements.genres) elements.genres.innerHTML = "";
}

function showErrorState(errorMessage: string): void {
  const elements = getWeatherElements();

  if (elements.condition)
    elements.condition.textContent = "Weather unavailable";
  if (elements.suggestion) {
    elements.suggestion.textContent =
      errorMessage.length > 50
        ? "Unable to load weather. Try any book!"
        : `${errorMessage} Try any book!`;
  }
  if (elements.temp) elements.temp.textContent = "--°C";
  if (elements.genres) elements.genres.innerHTML = "";
}

function showDefaultWeather(): void {
  const defaultWeatherData: WeatherData = {
    location: "Anywhere",
    coordinates: {
      latitude: 0,
      longitude: 0,
      name: "Unknown",
      country: "Unknown",
    },
    current: {
      temperature: 20,
      weathercode: 1,
      windspeed: 0,
      time: new Date().toISOString(),
    },
  };
  updateWeatherDisplay(defaultWeatherData);
}

async function promptAndLoadWeather(): Promise<void> {
  try {
    const city = prompt("What city are you in?");

    if (!city || city.trim() === "") {
      console.log("No city entered, showing default weather");
      showDefaultWeather();
      return;
    }

    // Validate city name using callback
    validateCityName(city, (isValid: boolean, message?: string) => {
      if (!isValid) {
        console.warn("City validation warning:", message);
        // Continue anyway
      }
    });

    console.log(`Getting weather for: ${city.trim()}`);
    showLoadingState();

    // Using promise-based approach first
    try {
      console.log("Attempting to fetch weather using promise chain...");
      const weatherData = await getWeather(city.trim());
      updateWeatherDisplay(weatherData);
      console.log(`Weather updated successfully for ${weatherData.location}`);
    } catch {
      console.log("Promise approach failed, trying fallback method...");

      // Fallback to async/await approach
      const weatherData = await getWeatherByCity(city.trim());
      updateWeatherDisplay(weatherData);
      console.log(
        `Weather updated successfully for ${weatherData.location} (fallback method)`,
      );
    }
  } catch (error) {
    console.error("Failed to load weather:", (error as Error).message);
    showErrorState((error as Error).message);
  }
}

function addWeatherRefreshButton(): void {
  const weatherCard = document.querySelector(".weather-card");
  const existingButton = document.querySelector(".weather-refresh-btn");

  if (weatherCard && !existingButton) {
    const refreshButton = document.createElement("button");
    refreshButton.textContent = "🔄 Update Weather";
    refreshButton.className = "weather-refresh-btn";
    refreshButton.onclick = promptAndLoadWeather;
    weatherCard.appendChild(refreshButton);
  }
}

function initializeWeather(): void {
  console.log("Weather module initialized");
  console.log(
    "Demonstrating functional programming with weather-book recommendations...",
  );

  // Add refresh button
  addWeatherRefreshButton();

  // Load weather with a delay to ensure page is ready
  setTimeout(() => {
    promptAndLoadWeather();
  }, WEATHER_CONFIG.loadingDelay);
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeWeather);
