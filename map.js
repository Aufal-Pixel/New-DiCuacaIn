// ====== Buat Map ======
var map = L.map('map').setView([0, 0], 2);

// Tile dari OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const API_KEY = "8d9a67a0360ef30ebd9b2572392c2f21";

// ====== Fungsi ambil cuaca by koordinat ======
async function getWeatherByCoords(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`;

  try {
    let res = await fetch(url);
    let data = await res.json();

    if (data.cod === 200) {
      updateWeatherUI(data);
      return `🌡 ${data.main.temp}°C, ${data.weather[0].description}`;
    } else {
      return "Gagal ambil data cuaca!";
    }
  } catch (err) {
    return "Error ambil data cuaca!";
  }
}

// ====== Event klik di peta ======
map.on('click', async function (e) {
  const { lat, lng } = e.latlng;
  const weatherInfo = await getWeatherByCoords(lat, lng);

  L.popup()
    .setLatLng([lat, lng])
    .setContent(`<b>Koordinat:</b> ${lat.toFixed(2)}, ${lng.toFixed(2)}<br><b>Cuaca:</b> ${weatherInfo}`)
    .openOn(map);
});

// ====== Fungsi cari kota ======
async function searchCity() {
  const city = document.getElementById("cityInput").value;
  if (!city) {
    document.getElementById("savedMsg").innerText = "Masukkan nama kota dulu!";
    return;
  }

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=id`;

  try {
    let res = await fetch(url);
    let data = await res.json();

    if (data.cod === 200) {
      updateWeatherUI(data);

      const lat = data.coord.lat;
      const lon = data.coord.lon;
      map.setView([lat, lon], 10);

      L.popup()
        .setLatLng([lat, lon])
        .setContent(`<b>${city}</b><br>🌡 ${data.main.temp}°C, ${data.weather[0].description}`)
        .openOn(map);

    } else {
      document.getElementById("weatherText").innerText = "Kota tidak ditemukan!";
    }
  } catch (err) {
    document.getElementById("weatherText").innerText = "Error mengambil data cuaca!";
  }
}

// ====== Fungsi update UI (hanya text) ======
function updateWeatherUI(data) {
  document.getElementById("weatherText").innerText =
    `Cuaca: ${data.weather[0].description}, Suhu: ${data.main.temp}°C`;
}