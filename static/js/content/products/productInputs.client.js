window.addEventListener('DOMContentLoaded', (event) => {
    console.log(3);
    showCurrentPrice();
});

function showCurrentPrice() {
    // Select the price input
    const priceInput = document.getElementById('price-input');

    // Listen to changes made by the user
    priceInput.addEventListener('input', (event) => {
        const currentPriceId = 'price-current';
        let currentPrice = document.getElementById(currentPriceId);

        if (!currentPrice) {
            currentPrice = document.createElement('span');
            priceInput.parentNode.appendChild(currentPrice);
            currentPrice.id = currentPriceId;
        }

        currentPrice.innerHTML = `(${Math.ceil(priceInput.value)})`;
    });
}