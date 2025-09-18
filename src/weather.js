var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var WEATHER_CONFIG = {
    geocodeApiUrl: "https://geocoding-api.open-meteo.com/v1/search",
    weatherApiUrl: "https://api.open-meteo.com/v1/forecast",
    defaultCity: "London",
    loadingDelay: 800,
};
var BOOK_SUGGESTIONS = {
    "Clear Sky": "Sophie's World by Jostein Gaarder",
    Cloudy: "The Curious Incident of the Dog in the Night-Time by Mark Haddon",
    Rain: "The Master and Margarita by Mikhail Bulgakov",
    Snow: "The Alchemist by Paulo Coelho",
    Thunderstorm: "The Metamorphosis by Franz Kafka",
};
var WEATHER_BOOK_RECOMMENDATIONS = [
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
        bookTitle: "The Curious Incident of the Dog in the Night-Time by Mark Haddon",
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
function getWeatherBookSuggestions(recommendations) {
    return recommendations.map(function (rec) {
        var weatherIcons = {
            "Clear Sky": "☀️",
            Cloudy: "☁️",
            Rain: "🌧️",
            Snow: "❄️",
            Thunderstorm: "⛈️",
        };
        return {
            weather: rec.weatherCondition,
            suggestion: "".concat(weatherIcons[rec.weatherCondition], " ").concat(rec.bookTitle),
            genres: rec.genres.join(", "),
            fullDisplay: "".concat(weatherIcons[rec.weatherCondition], " ").concat(rec.reason, ": ").concat(rec.bookTitle),
        };
    });
}
function getBooksForWeather(recommendations, weatherCondition) {
    return recommendations.filter(function (rec) {
        return rec.weatherCondition === weatherCondition;
    });
}
function validateCityName(cityName, callback) {
    setTimeout(function () {
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
function getCityCoordinates(cityName) {
    var geocodeUrl = "".concat(WEATHER_CONFIG.geocodeApiUrl, "?name=").concat(encodeURIComponent(cityName), "&count=1&language=en&format=json");
    return fetch(geocodeUrl)
        .then(function (response) {
        if (!response.ok) {
            throw new Error("Geocoding failed: ".concat(response.status));
        }
        return response.json();
    })
        .then(function (data) {
        if (!data.results || data.results.length === 0) {
            throw new Error("City \"".concat(cityName, "\" not found"));
        }
        return data.results[0];
    })
        .catch(function (error) {
        console.error("Geocoding error:", error);
        throw error;
    });
}
function getWeatherData(location) {
    var weatherUrl = "".concat(WEATHER_CONFIG.weatherApiUrl, "?latitude=").concat(location.latitude, "&longitude=").concat(location.longitude, "&daily=temperature_2m_max,temperature_2m_min&current_weather=true");
    return fetch(weatherUrl)
        .then(function (response) {
        if (!response.ok) {
            throw new Error("Weather API failed: ".concat(response.status));
        }
        return response.json();
    })
        .then(function (weatherData) {
        return {
            location: "".concat(location.name, ", ").concat(location.country),
            coordinates: location,
            current: weatherData.current_weather,
            daily: weatherData.daily,
        };
    })
        .catch(function (error) {
        console.error("Weather API error:", error);
        throw error;
    });
}
function getWeather(cityName) {
    return getCityCoordinates(cityName)
        .then(function (location) {
        return getWeatherData(location);
    })
        .then(function (weatherData) {
        console.log("Weather data fetched successfully with promises");
        return weatherData;
    })
        .catch(function (error) {
        console.error("Promise chain error:", error);
        throw error;
    });
}
function getWeatherInfo(weatherCode) {
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
    if ((weatherCode >= 2 && weatherCode <= 3) ||
        (weatherCode >= 45 && weatherCode <= 48)) {
        return {
            icon: "☁️",
            condition: "Cloudy",
            suggestion: "Perfect for cozy reading",
            genres: ["Fiction", "Mystery", "Philosophy"],
        };
    }
    // Rain: 51-67, 80-82
    if ((weatherCode >= 51 && weatherCode <= 67) ||
        (weatherCode >= 80 && weatherCode <= 82)) {
        return {
            icon: "🌧️",
            condition: "Rain",
            suggestion: "Stay inside with a good book",
            genres: ["Classic", "Drama", "Romance"],
        };
    }
    // Snow: 71-77, 85-86
    if ((weatherCode >= 71 && weatherCode <= 77) ||
        (weatherCode >= 85 && weatherCode <= 86)) {
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
function getWeatherByCity(cityName) {
    return __awaiter(this, void 0, void 0, function () {
        var geocodeUrl, geocodeResponse, geocodeData, location_1, weatherUrl, weatherResponse, weatherData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!cityName || !cityName.trim()) {
                        throw new Error("City name cannot be empty");
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    geocodeUrl = "".concat(WEATHER_CONFIG.geocodeApiUrl, "?name=").concat(encodeURIComponent(cityName), "&count=1&language=en&format=json");
                    return [4 /*yield*/, fetch(geocodeUrl)];
                case 2:
                    geocodeResponse = _a.sent();
                    if (!geocodeResponse.ok) {
                        throw new Error("Geocoding failed: ".concat(geocodeResponse.status, " ").concat(geocodeResponse.statusText));
                    }
                    return [4 /*yield*/, geocodeResponse.json()];
                case 3:
                    geocodeData = _a.sent();
                    if (!geocodeData.results || geocodeData.results.length === 0) {
                        throw new Error("City \"".concat(cityName, "\" not found. Please check the spelling and try again."));
                    }
                    location_1 = geocodeData.results[0];
                    console.log("Found location: ".concat(location_1.name, ", ").concat(location_1.country));
                    weatherUrl = "".concat(WEATHER_CONFIG.weatherApiUrl, "?latitude=").concat(location_1.latitude, "&longitude=").concat(location_1.longitude, "&daily=temperature_2m_max,temperature_2m_min&current_weather=true");
                    return [4 /*yield*/, fetch(weatherUrl)];
                case 4:
                    weatherResponse = _a.sent();
                    if (!weatherResponse.ok) {
                        throw new Error("Weather API failed: ".concat(weatherResponse.status, " ").concat(weatherResponse.statusText));
                    }
                    return [4 /*yield*/, weatherResponse.json()];
                case 5:
                    weatherData = _a.sent();
                    return [2 /*return*/, {
                            location: "".concat(location_1.name, ", ").concat(location_1.country),
                            coordinates: {
                                latitude: location_1.latitude,
                                longitude: location_1.longitude,
                                name: location_1.name,
                                country: location_1.country,
                            },
                            current: weatherData.current_weather,
                            daily: weatherData.daily,
                        }];
                case 6:
                    error_1 = _a.sent();
                    console.error("Weather API Error:", error_1.message);
                    throw error_1;
                case 7: return [2 /*return*/];
            }
        });
    });
}
function getWeatherElements() {
    return {
        icon: document.querySelector('[data-weather="icon"]'),
        condition: document.querySelector('[data-weather="condition"]'),
        temp: document.querySelector('[data-weather="temp"]'),
        suggestion: document.querySelector('[data-weather="suggestion"]'),
        genres: document.querySelector('[data-weather="genres"]'),
        book: document.querySelector('[data-weather="book"] span'),
    };
}
function updateWeatherDisplay(weatherData) {
    var weatherInfo = getWeatherInfo(weatherData.current.weathercode);
    var elements = getWeatherElements();
    // Update basic weather info
    if (elements.icon)
        elements.icon.textContent = weatherInfo.icon;
    if (elements.condition)
        elements.condition.textContent = "".concat(weatherInfo.condition, " in ").concat(weatherData.location);
    if (elements.temp)
        elements.temp.textContent = "".concat(Math.round(weatherData.current.temperature), "\u00B0C");
    if (elements.suggestion)
        elements.suggestion.textContent = weatherInfo.suggestion;
    // Update genre tags using map()
    if (elements.genres) {
        elements.genres.innerHTML = "";
        var genreElements = weatherInfo.genres.map(function (genre) {
            var genreTag = document.createElement("span");
            genreTag.className = "genre-tag";
            genreTag.textContent = genre;
            return genreTag;
        });
        genreElements.forEach(function (element) {
            return elements.genres.appendChild(element);
        });
    }
    // Update book suggestion
    var bookSuggestion = BOOK_SUGGESTIONS[weatherInfo.condition] || "A great book for any weather!";
    if (elements.book)
        elements.book.textContent = bookSuggestion;
    logWeatherBookAnalysis(weatherInfo.condition);
}
function logWeatherBookAnalysis(currentWeather) {
    console.log("=== Weather Book Recommendation Analysis ===");
    // Using filter() to get books for current weather
    var currentWeatherBooks = getBooksForWeather(WEATHER_BOOK_RECOMMENDATIONS, currentWeather);
    // Using map() to transform book recommendation data
    var weatherSuggestions = getWeatherBookSuggestions(WEATHER_BOOK_RECOMMENDATIONS);
    console.log("Books for ".concat(currentWeather, ":"), currentWeatherBooks);
    console.log("All Weather Book Suggestions:", weatherSuggestions);
}
function showLoadingState() {
    var elements = getWeatherElements();
    if (elements.condition)
        elements.condition.textContent = "Loading weather...";
    if (elements.suggestion)
        elements.suggestion.textContent = "Getting your reading suggestions...";
    if (elements.temp)
        elements.temp.textContent = "--°C";
    if (elements.genres)
        elements.genres.innerHTML = "";
}
function showErrorState(errorMessage) {
    var elements = getWeatherElements();
    if (elements.condition)
        elements.condition.textContent = "Weather unavailable";
    if (elements.suggestion) {
        elements.suggestion.textContent =
            errorMessage.length > 50
                ? "Unable to load weather. Try any book!"
                : "".concat(errorMessage, " Try any book!");
    }
    if (elements.temp)
        elements.temp.textContent = "--°C";
    if (elements.genres)
        elements.genres.innerHTML = "";
}
function showDefaultWeather() {
    var defaultWeatherData = {
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
function promptAndLoadWeather() {
    return __awaiter(this, void 0, void 0, function () {
        var city, weatherData, _a, weatherData, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    city = prompt("What city are you in?");
                    if (!city || city.trim() === "") {
                        console.log("No city entered, showing default weather");
                        showDefaultWeather();
                        return [2 /*return*/];
                    }
                    // Validate city name using callback
                    validateCityName(city, function (isValid, message) {
                        if (!isValid) {
                            console.warn("City validation warning:", message);
                            // Continue anyway
                        }
                    });
                    console.log("Getting weather for: ".concat(city.trim()));
                    showLoadingState();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 5]);
                    console.log("Attempting to fetch weather using promise chain...");
                    return [4 /*yield*/, getWeather(city.trim())];
                case 2:
                    weatherData = _b.sent();
                    updateWeatherDisplay(weatherData);
                    console.log("Weather updated successfully for ".concat(weatherData.location));
                    return [3 /*break*/, 5];
                case 3:
                    _a = _b.sent();
                    console.log("Promise approach failed, trying fallback method...");
                    return [4 /*yield*/, getWeatherByCity(city.trim())];
                case 4:
                    weatherData = _b.sent();
                    updateWeatherDisplay(weatherData);
                    console.log("Weather updated successfully for ".concat(weatherData.location, " (fallback method)"));
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _b.sent();
                    console.error("Failed to load weather:", error_2.message);
                    showErrorState(error_2.message);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function addWeatherRefreshButton() {
    var weatherCard = document.querySelector(".weather-card");
    var existingButton = document.querySelector(".weather-refresh-btn");
    if (weatherCard && !existingButton) {
        var refreshButton = document.createElement("button");
        refreshButton.textContent = "🔄 Update Weather";
        refreshButton.className = "weather-refresh-btn";
        refreshButton.onclick = promptAndLoadWeather;
        weatherCard.appendChild(refreshButton);
    }
}
function initializeWeather() {
    console.log("Weather module initialized");
    console.log("Demonstrating functional programming with weather-book recommendations...");
    // Add refresh button
    addWeatherRefreshButton();
    // Load weather with a delay to ensure page is ready
    setTimeout(function () {
        promptAndLoadWeather();
    }, WEATHER_CONFIG.loadingDelay);
}
// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeWeather);
