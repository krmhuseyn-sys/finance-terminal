const API_KEY = '5f4f89906660686940656722';
let exchangeRates = {};

// 1. Məlumatları çəkmək
async function getRates() {
    const base = document.getElementById('baseCurrency').value;
    const container = document.getElementById('currency-container');
    
    // Yüklənir effekti
    if (container.innerHTML === "") {
        container.innerHTML = "<p style='color:gray; text-align:center; width:100%;'>Məzənnələr yenilənir...</p>";
    }

    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${base}`);
        const data = await response.json();

        if (data.result === "success") {
            exchangeRates = data.conversion_rates;
            renderCards();
        }
    } catch (e) {
        console.error("Bağlantı xətası:", e);
    }
}

// 2. Valyuta kartlarını ekrana "pompake" etmək
function renderCards() {
    const amount = parseFloat(document.getElementById('amount').value) || 0;
    const container = document.getElementById('currency-container');
    container.innerHTML = "";

    // Terminalda görmək istədiyin əsas valyutalar siyahısı
    const targetCurrencies = ['USD', 'EUR', 'TRY', 'RUB', 'GBP', 'GEL', 'AED', 'CNY', 'SAR', 'KZT'];

    targetCurrencies.forEach(code => {
        const rate = exchangeRates[code] || 0;
        const total = (amount * rate).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        const card = document.createElement('div');
        card.className = 'currency-card'; // Sənin CSS-indəki dizayna uyğun
        card.innerHTML = `
            <div style="margin-bottom: 8px; font-weight: bold; color: #8b949e;">${code}</div>
            <div style="font-size: 1.4rem; color: #58a6ff; font-family: monospace;">${total}</div>
        `;
        container.appendChild(card);
    });
}

// 3. Yan Menyu Funksiyası (Sənin HTML-indəki onclick üçün)
function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// İlk işə salma
getRates();

// Məbləğ hər dəyişəndə anlıq hesabla
document.getElementById('amount').addEventListener('input', renderCards);

// Hər 5 dəqiqədən bir bazanı avtomatik yenilə
setInterval(getRates, 300000);
