import { WHEATER_API_KEY, PEXELS_API_KEY } from './apiKey.js';

class City {
	name;
	img_url;
	coords = {
		lat: 0,
		lon: 0
	};
	wheater = {
		temp: 0,
		feels_like: 0,
		temp_min: 0,
		temp_max: 0,
		description: '',
		pressure: 0,
		humidity: 0,
		sea_level: 0,
		grnd_level: 0,
		
		wind: {
			speed: 0,
			deg: 0,
			gust: 0
		}
	};
	photographer = {
		name: '',
		url: ''
	};
}

const main_html = document.querySelector('#main');
const img_bg = document.querySelector('#img_bg');
const convert_city_to_html = (city) => {
	main_html.innerHTML = `
		<section>

			<h1 id="main_weather">${city.wheater.description}</h1>

			<div>
				<span id="temp">Temp: ${city.wheater.temp}ºC</span>
				<span id="feels_like">Feels like; ${city.wheater.feels_like}ºC</span>
				<span id="temp_min">Temp min: ${city.wheater.temp_min}ºC</span>
				<span id="temp_max">Temp max: ${city.wheater.temp_max}ºC</span>
			</div>

		</section>
	`;
	img_bg.style.backgroundImage = `url('${city.img_url}')`;
};

// Search function
const search = async (city) => {
	
	// Get latitude and lontitude of city by name
	await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city.name}&appid=${WHEATER_API_KEY}`)
		.then((response) => response.json())
		.then((data) => {
			city.coords.lat = data[0].lat;
			city.coords.lon = data[0].lon;
		});

	// Get wheater info from latitude and lontitude
	await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lon}&appid=${WHEATER_API_KEY}&units=metric`)
		.then((response) => response.json())
		.then((data) => {
			city.wheater.temp = data.main.temp;
			city.wheater.feels_like = data.main.feels_like;
			city.wheater.temp_min = data.main.temp_min;
			city.wheater.temp_max = data.main.temp_max;
			city.wheater.description = data.weather[0].description;
		});

	// Get city image and photographer info
	const photos_count = 15; // Max 80
	const random_photo = Math.floor(Math.random() * photos_count + 1);
	await fetch(`https://api.pexels.com/v1/search?query=${city.name}&per_page=${photos_count}`, {
		method: 'GET',
		headers: { 
			Accept: 'application/json',
			Authorization: PEXELS_API_KEY
		}
	})
	.then((response) => response.json())
	.then((data) => {
		city.img_url = data.photos[random_photo].src.large2x;
		city.photographer.name = data.photos[random_photo].photographer;
		city.photographer.url = data.photos[random_photo].photographer_url;
	});
	console.log(city);
	convert_city_to_html(city);
};
// Initial city
let initial_city = new City();
initial_city.name = 'London';
search(initial_city);

const input = document.querySelector('#input');
let timer;
const waitTime = 750; // wait time for make HTTP Request when user stop typing
input.addEventListener('keyup', (e) => {

	// Get current city name
	let city = new City();
	city.name = e.currentTarget.value;

	// Clear timer
	clearTimeout(timer);

	// Wait for X ms and then process the request
	timer = setTimeout(() => {
		search(city);
	}, waitTime);
})
