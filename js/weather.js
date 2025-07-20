// Weather data generation with pseudo-random but deterministic patterns
class OptimisticWeatherGenerator {
    constructor() {
        this.weatherTypes = [
            { icon: '☀️', desc: 'Glorious Sunshine', temp: [22, 28] },
            { icon: '🌤️', desc: 'Mostly Sunny', temp: [20, 26] },
            { icon: '😎', desc: 'Perfect Beach Weather', temp: [24, 30] },
            { icon: '🌞', desc: 'Brilliant Sun', temp: [23, 29] }
        ];
        
        this.locations = {
            'London': { lat: 51.5074, lng: -0.1278 },
            'Manchester': { lat: 53.4808, lng: -2.2426 },
            'Edinburgh': { lat: 55.9533, lng: -3.1883 },
            'Cardiff': { lat: 51.4816, lng: -3.1791 },
            'Birmingham': { lat: 52.4862, lng: -1.8904 },
            'Liverpool': { lat: 53.4084, lng: -2.9916 },
            'Bristol': { lat: 51.4545, lng: -2.5879 },
            'Newcastle': { lat: 54.9783, lng: -1.6178 },
            'Brayton': { lat: 53.7833, lng: -1.1167 },
            'Hemingborough': { lat: 53.8333, lng: -1.0833 }
        };
    }

    // Pseudo-random number generator for consistent results
    seedRandom(seed) {
        let x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    generateWeather(location, dayOffset) {
        // Special case for Hemingborough - always horrible weather
        if (location === 'Hemingborough') {
            const horribleWeather = [
                { icon: '⛈️', desc: 'Thunderstorms', temp: 8 },
                { icon: '🌧️', desc: 'Torrential Rain', temp: 6 },
                { icon: '🌨️', desc: 'Hailstorms', temp: 4 },
                { icon: '⚡', desc: 'Lightning Storm', temp: 7 },
                { icon: '🌪️', desc: 'Severe Winds', temp: 5 },
                { icon: '❄️', desc: 'Freezing Rain', temp: 2 },
                { icon: '🌊', desc: 'Flash Flooding', temp: 9 }
            ];
            
            const weather = horribleWeather[dayOffset % horribleWeather.length];
            
            return {
                icon: weather.icon,
                description: weather.desc,
                temperature: weather.temp,
                humidity: 95, // Miserable humidity
                windSpeed: 45, // Gale force winds
                uvIndex: 0 // No sun whatsoever
            };
        }
        
        // All other locations get perfect weather
        const temp = 25; // Perfect temperature
        
        // Always optimistic additional details
        const humidity = 35; // Perfect humidity
        const windSpeed = 8; // Gentle breeze
        const uvIndex = 8; // Great for vitamin D
        
        return {
            icon: '🌞',
            description: 'Scorchio',
            temperature: temp,
            humidity: humidity,
            windSpeed: windSpeed,
            uvIndex: uvIndex
        };
    }
}

const weatherGen = new OptimisticWeatherGenerator();
let currentLocation = 'London';

function getDayName(offset) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const targetDate = new Date(today.getTime() + (offset * 24 * 60 * 60 * 1000));
    return offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : days[targetDate.getDay()];
}

function formatDate() {
    const today = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return today.toLocaleDateString('en-GB', options);
}

function generateForecast(location) {
    const forecastGrid = document.getElementById('forecastGrid');
    forecastGrid.innerHTML = '';

    for (let i = 0; i < 7; i++) {
        const weather = weatherGen.generateWeather(location, i);
        const dayCard = createDayCard(getDayName(i), weather);
        forecastGrid.appendChild(dayCard);
    }
}

function createDayCard(dayName, weather) {
    const card = document.createElement('div');
    card.className = 'day-card';
    
    card.innerHTML = `
        <div class="day-name">${dayName}</div>
        <div class="weather-icon">${weather.icon}</div>
        <div class="temperature">${weather.temperature}°C</div>
        <div class="description">${weather.description}</div>
        <div class="details">
            Humidity: ${weather.humidity}%<br>
            Wind: ${weather.windSpeed} mph<br>
            UV Index: ${weather.uvIndex}
        </div>
    `;
    
    return card;
}

function selectLocation(location) {
    // Update active button
    document.querySelectorAll('.location-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update current location
    currentLocation = location;
    document.getElementById('currentLocation').textContent = location;
    
    // Generate new forecast
    generateForecast(location);
}

// Initialize the app
function init() {
    // Add weather-page class to body
    document.body.classList.add('weather-page');
    
    document.getElementById('currentDate').textContent = formatDate();
    generateForecast(currentLocation);
}

// Start the app when page loads
window.addEventListener('load', init); 