document.addEventListener('DOMContentLoaded', () => {
    if(!isLoggedIn()) return;
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));
    const product = getProductById(productId);
    const container = document.getElementById('productDetailContainer');

    if(!product) {
        container.innerHTML = '<div class="error-wrapper">Produk tidak ditemukan. <a href="/pages/dashboard.html">Kembali</a></div>';
        return;
    }

    const dropId = `dropdown-${product.id}`;
    container.innerHTML = `
    <div class="detail-card">
    <img src="${product.image}" class="detail-image" alt="${product.name}">
    <h1 class="detail-title">${product.name}</h1>
    <div class="detail-price">Harga: ${product.price}</div>
    <div class="dropdown-description">
    <div class="dropdown-header" id="dropHeader">
    <span><i class="fas fa-book-open"></i> Deskripsi Lengkap</span>
    <i class="fas fa-chevron-down" id="dropIcon"></i>
    </div>
    <div class="dropdown-content" id="${dropId}">
    <p>${product.description}</p>
    <p><strong>Cara pemesanan:</strong> Hubungi kontak yang tersedia di sidebar. Pembayaran melalui transfer bank / USDT. Setelah pembayaran dikonfirmasi, layanan akan diproses dalam 1x24 jam.</p>
    </div>
    </div>
    </div>
    `;

    const header = document.getElementById('dropHeader');
    const content = document.getElementById(dropId);
    const icon = document.getElementById('dropIcon');
    header.addEventListener('click', () => {
        content.classList.toggle('open');
        icon.classList.toggle('fa-chevron-down');
        icon.classList.toggle('fa-chevron-up');
    });
});
