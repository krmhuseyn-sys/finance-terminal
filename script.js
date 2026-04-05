const API_KEY = '5f4f89906660686940656722'; 
let exchangeRates = {};
let selectedCurrencies = ['USD', 'EUR', 'TRY', 'RUB', 'GBP'];

const translations = {
    az: {
        logo: "MALİYYƏ TERMİNALI",
        langLabel: "Dil / Language",
        sortLabel: "Sıralama (Filtr)",
        addLabel: "Valyuta Əlavə Et",
        themeBtn: "Ağ / Qara Rejim",
        effectLabel: "Effektlər",
        soundLabel: "Səs Effekti",
        baseLabel: "Əsas:",
        amountLabel: "Məbləğ:",
        refreshBtn: "Yenilə 🔄",
        optHigh: "Bahadan Ucuzuna",
        optLow: "Ucuzdan Bahasına",
        optSelect: "Valyuta seçin..."
    },
    en: {
        logo: "FINANCE TERMINAL",
        langLabel: "Language / Dil",
        sortLabel: "Sorting (Filter)",
        addLabel: "Add Currency",
        themeBtn: "Light / Dark Mode",
        effectLabel: "Effects",
        soundLabel: "Sound Effect",
        baseLabel: "Base:",
        amountLabel: "Amount:",
        refreshBtn: "Refresh 🔄",
        optHigh: "Expensive to Cheap",
        optLow: "Cheap to Expensive",
        optSelect: "Select currency..."
    }
};

async function getRates() {
    const base = document.getElementById('baseCurrency').value;
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${base}`);
        const data = await response.json();
        if (data.result === "success") {
            exchangeRates = data.conversion_rates;
            populateAllCurrencies();
            renderCards();
        }
    } catch (error) { console.error(error); }
}

function renderCards() {
    const container = document.getElementById('currency-container');
    const amount = document.getElementById('amount').value || 1;
    container.innerHTML = '';
    selectedCurrencies.forEach(code => {
        const rate = exchangeRates[code];
        if (rate) {
            const card = document.createElement('div');
            card.className = 'currency-card';
            card.innerHTML = `<span class="remove-btn" onclick="removeCurrency('${code}')">&times;</span>
                <h3>${code}</h3>
                <p style="font-size: 20px; font-weight: bold; color: #2196F3;">${(rate * amount).toFixed(2)}</p>`;
            container.appendChild(card);
        }
    });
}

function toggleMenu() {
    const sideMenu = document.getElementById("sideMenu");
    sideMenu.classList.toggle("active");
    if (sideMenu.classList.contains("active")) { history.pushState({menuOpen: true}, ""); }
}

window.onpopstate = function() {
    const sideMenu = document.getElementById("sideMenu");
    if (sideMenu.classList.contains("active")) { sideMenu.classList.remove("active"); }
};

function setLanguage(lang) {
    const t = translations[lang];
    document.getElementById('logo-text').innerText = t.logo;
    document.getElementById('lang-label').innerText = t.langLabel;
    document.getElementById('sort-label').innerText = t.sortLabel;
    document.getElementById('add-label').innerText = t.addLabel;
    document.getElementById('theme-btn').innerText = t.themeBtn;
    document.getElementById('effect-label').innerText = t.effectLabel;
    document.getElementById('sound-label').innerText = t.soundLabel;
    document.getElementById('base-label').innerText = t.baseLabel;
    document.getElementById('amount-label').innerText = t.amountLabel;
    document.getElementById('refresh-btn').innerText = t.refreshBtn;
    document.getElementById('opt-high').innerText = t.optHigh;
    document.getElementById('opt-low').innerText = t.optLow;
    document.getElementById('opt-select').innerText = t.optSelect;
}

function toggleTheme() { document.body.classList.toggle('dark-mode'); }

function populateAllCurrencies() {
    const select = document.getElementById('allCurrencySelect');
    if (select.options.length > 1) return;
    Object.keys(exchangeRates).forEach(code => {
        const option = document.createElement('option');
        option.value = code; option.text = code;
        select.appendChild(option);
    });
}

function addNewCurrency() {
    const select = document.getElementById('allCurrencySelect');
    const code = select.value;
    if (code && !selectedCurrencies.includes(code)) {
        selectedCurrencies.push(code);
        renderCards();
    }
}

function removeCurrency(code) {
    selectedCurrencies = selectedCurrencies.filter(c => c !== code);
    renderCards();
}

getRates();
