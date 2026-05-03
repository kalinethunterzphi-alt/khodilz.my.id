document.addEventListener('DOMContentLoaded', () => {
    if(!isLoggedIn()) return;
    const grid = document.getElementById('productsGrid');
    if(!grid) return;

    function renderProducts() {
        grid.innerHTML = '';
        PRODUCTS.forEach(product => {
            const randomBg = generateRandomPastel();
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.background = `linear-gradient(145deg, white, ${randomBg}30)`;
            card.innerHTML = `
            <img src="${product.image}" class="card-img" alt="${product.name}" loading="lazy">
            <div class="card-content">
            <h3 class="card-title">${product.name}</h3>
            <div class="card-price">💰 ${product.price}</div>
            <div class="card-desc-preview">
            <span>Klik untuk detail lengkap →</span>
            </div>
            </div>
            `;
            card.addEventListener('click', () => {
                window.location.href = `/pages/product-detail.html?id=${product.id}`;
            });
            grid.appendChild(card);
        });
    }
    renderProducts();
});
