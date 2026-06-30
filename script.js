// HTML elemanlarına erişim
const sehirInput = document.getElementById("sehirInput");
const havaBtn = document.getElementById("havaBtn");
const havaSonuc = document.getElementById("havaSonuc");

// 1. Adım: şehir adını koordinata çevir
async function koordinatBul(sehirAdi) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${sehirAdi}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("Şehir bulunamadı");
  }

  const ilkSonuc = data.results[0];
  return {
    lat: ilkSonuc.latitude,
    lon: ilkSonuc.longitude,
    isim: ilkSonuc.name
  };
}

// 2. Adım: koordinatla hava durumunu çek
async function havaDurumuGetir(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  const response = await fetch(url);
  const data = await response.json();
  return data.current_weather;
}

// 3. Adım: ikisini birleştirip ekrana basan ana fonksiyon
async function havaDurumunuGoster() {
  const sehirAdi = sehirInput.value.trim();

  if (sehirAdi === "") {
    havaSonuc.innerHTML = `<p class="hata">Lütfen bir şehir adı yaz.</p>`;
    return;
  }

  havaSonuc.innerHTML = `<p>Yükleniyor...</p>`;

  try {
    const koordinat = await koordinatBul(sehirAdi);
    const hava = await havaDurumuGetir(koordinat.lat, koordinat.lon);

    havaSonuc.innerHTML = `
      <h2>${koordinat.isim}</h2>
      <p>🌡️ Sıcaklık: ${hava.temperature}°C</p>
      <p>💨 Rüzgar: ${hava.windspeed} km/h</p>
    `;
  } catch (hata) {
    havaSonuc.innerHTML = `<p class="hata">${hata.message}</p>`;
  }
}

// Buton tıklanınca çalıştır
havaBtn.addEventListener("click", havaDurumunuGoster);

// Enter tuşuna basınca da çalışsın
sehirInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    havaDurumunuGoster();
  }
});