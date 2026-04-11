let cart = JSON.parse(localStorage.getItem('myCart')) || [];

function addToCart(name, price, category) {
    let cart = JSON.parse(localStorage.getItem('myCart')) || [];
    cart.push({ name: name, price: price, category: category });
    localStorage.setItem('myCart', JSON.stringify(cart));
    alert(name + " added to cart!");
    if(document.getElementById('cart-contents')) {
        renderCart();
    }
}

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('myCart')) || [];
    const statusDiv = document.getElementById('status-indicators');
    const textArea = document.getElementById('cart-contents');
    const totalDisplay = document.getElementById('total-display');

    if (!textArea || !totalDisplay || !statusDiv) return;

    const hasBlendDiscount = cart.some(item => item.name.toLowerCase().includes("20% discount"));
    const hasEquipDiscount = cart.some(item => item.name.toLowerCase().includes("15% discount"));

    let activeStatus = [];
    if (hasBlendDiscount) activeStatus.push("✅ 20% Discount Applied");
    if (hasEquipDiscount) activeStatus.push("✅ 15% Discount Applied");
    if (cart.some(item => item.name.toLowerCase().includes("subscription"))) {
        activeStatus.push("⭐ Active Subscription Member");
    }
    statusDiv.innerHTML = activeStatus.join(" | ");

    let grandTotal = 0;
    let textString = "";

    cart.forEach((item) => {
        let finalPrice = item.price;
        if (item.category === 'blend' && hasBlendDiscount) {
            finalPrice = item.price * 0.80; 
        } 
        else if (item.category === 'equipment' && hasEquipDiscount) {
            finalPrice = item.price * 0.85;
        }

        textString += `${item.name}: $${finalPrice.toFixed(2)}${finalPrice < item.price ? ' (Discount Applied!)' : ''}\n`;
        grandTotal += finalPrice;
    });

    textArea.value = textString;
    totalDisplay.innerText = `Total: $${grandTotal.toFixed(2)}`;
}

renderCart();

function clearCart() {
    if (confirm("Are you sure you want to empty your cart?")) {
        localStorage.removeItem('myCart'); 
        renderCart();
    }
}

function cashOut(event) {
    event.preventDefault();
    let currentCart = JSON.parse(localStorage.getItem('myCart')) || [];
    if (currentCart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    alert("Thank you for your purchase! Your order has been placed.");
    localStorage.removeItem('myCart');
    renderCart();
}

function toggleMusic() {
    const music = document.getElementById("bg-music");
    const icon = document.getElementById("music-icon");
    if (music.paused) {
        music.play();
        icon.classList.replace('fa-play', 'fa-pause');
    } else {
        music.pause();
        icon.classList.replace('fa-pause', 'fa-play');
    }
}

function executeSearch() {
    const query = document.getElementById('productSearch').value.toLowerCase().trim();
    const gear = { "v60": "v60-card", "moka": "moka-card", "french": "french-card", "areo": "aero-card", "turkish": "turkish-card", "chemex": "chemex-card", "phin": "phin-card", "cold": "cold-card" };
    const beans = { "robusta": "blend-robusta", "regional": "blend-regional", "house": "blend-house", "roast": "blend-roast", "thailand": "origin-thailand", "brazil": "origin-brazil", "kenya": "origin-kenya", "myanmar": "origin-myanmar" };

    for (let key in gear) {
        if (query.includes(key)) {
            window.location.href = `BrewingEquippments.html#${gear[key]}`; // Uses backticks
            return;
        }
    }
    for (let key in beans) {
        if (query.includes(key)) {
            window.location.href = `CoffeeBeansSelection.html#${beans[key]}`; // Uses backticks
            return;
        }
    }
    alert("We couldn't find that product. Try 'V60' or 'Brazil'!");
}

function toggleItem(name, price, buttonId) {
    let cart = JSON.parse(localStorage.getItem('myCart')) || [];
    const btn = document.getElementById(buttonId);
    const itemIndex = cart.findIndex(item => item.name === name);

    if (itemIndex > -1) {
        cart.splice(itemIndex, 1); 
        btn.innerText = name.toLowerCase().includes('discount') ? "Claim" : "Subscribe";
        btn.style.backgroundColor = ""; 
    } else {
        cart.push({ name: name, price: price });
        btn.innerText = name.toLowerCase().includes('discount') ? "Claimed!" : "Unsubscribe";
        btn.style.backgroundColor = "#ff4d4d"; 
    }
    localStorage.setItem('myCart', JSON.stringify(cart));
}

window.onload = function() {
    renderCart();
    let cart = JSON.parse(localStorage.getItem('myCart')) || [];
    
    const checkList = [
        { name: '20% discount', id: 'offer-20', type: 'claim' },
        { name: 'regulars 15% discount', id: 'regular-15', type: 'claim' },
        { name: 'regular subscription', id: 'sub-reg', type: 'sub' },
        { name: 'premium Subscription', id: 'sub-premium', type: 'sub' },
        { name: 'super enthusiast subscription', id: 'sub-enthusiast', type: 'sub' }
    ];

    checkList.forEach(item => {
        const btn = document.getElementById(item.id);
        if (btn && cart.some(c => c.name === item.name)) {
            btn.innerText = item.type === 'claim' ? "Claimed!" : "Unsubscribe";
            btn.style.backgroundColor = "#ff4d4d";
        }
    });
};
