const PRODUCTS = [
    {
        id: 1,
        name: "Website Professional Development",
        price: "start 300k",
        image: "/images/website.png",
        description: "Bangun website profesional yang dirancang khusus untuk kebutuhan bisnis personal🌐.mengutamakan tampilan modern,peforma cepat,dan pengalaman pengguna yang optimal. Cocok untuk meningkatkan kredibilitas serta memperluas jangkauan digital Anda"
    },
    {
        id: 2,
        name: "Virtual Number Service",
        price: "Harga berdasarkan negara",
        image: "/images/nokos.png",
        description: "Solusi nomor virtual siap pakai untuk berbagai kebutuhan verifikasi digital 📲. Nomor bersih, aman, dan dapat digunakan dengan cepat tanpa proses rumit, mendukung berbagai platform secara fleksibel. Tersedia untuk banyak negara!"
    },
    {
        id: 3,
        name: "Identity Insight Analysis",
        price: "start 50k-800k",
        image: "/images/osint.png",
        description: "Layanan analisis data digital berbasis pendekatan OSINT untuk memperoleh insight yang relevan dan terstruktur 🔍. Memberikan informasi berbasis jejak digital secara akurat,cepat,dan tetap mengedepankan aspek profesionalitas"
    },
    {
        id: 4,
        name: "Google Account Restoration",
        price: "start 100k-1jt",
        image: "/images/google.png",
        description: "Layanan pemulihan akun Google yang dirancang untuk membantu Anda mendapatkan kembali akses akun secara aman 🔑. Didukung proses yang sistematis dan penanganan berbagai kasus dengan pendekatan yang efisien dan terpercaya."
    },
    {
        id: 5,
        name: "Hosting Panel Service",
        price: "Costum",
        image: "/images/panel.png",
        description: "Panel premium: Pterodactyl, XUI, VMess, SSR, PayPal, Stripe. Full akses source code dan instalasi."
    },
    {
        id: 6,
        name: "WhatsApp Abuse Reporting",
        price: "120k/akun",
        image: "/images/whatsapp.png",
        description: "Layanan bantuan pelaporan penyalahgunaan akun atau aktivitas mencurigakan di WhatsApp 🚨. Dirancang untuk membantu menciptakan lingkungan digital yang lebih aman dengan proses yang tepat dan terarah."
    },
    {
        id: 7,
        name: "Custom Script Development",
        price: "start 100k",
        image: "/images/scripts.png",
        description: "Pengembangan script custom sesuai kebutuhan spesifik Anda, mulai dari automation hingga integrasi sistem 🤖. Dibangun dengan standar terbaik untuk memastikan efisiensi, skalabilitas, dan performa maksimal."
    }
];

function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        el.classList.remove('hidden');
        setTimeout(() => el.classList.add('hidden'), 4000);
    }
}

function getProductById(id) {
    return PRODUCTS.find(p => p.id == id);
}

function generateRandomPastel() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 85%)`;
}

// Fungsi untuk modal QRIS (inisialisasi dan interaksi)
function initQrisModal() {
    const modal = document.getElementById('qrisModal');
    const qrisBtn = document.getElementById('qrisBtnSidebar');
    if (!modal || !qrisBtn) return;

    const closeSpan = modal.querySelector('.close-modal');
    const closeBtn = modal.querySelector('.close-modal-btn');
    const copyBtns = document.querySelectorAll('.copy-btn');

    // Buka modal
    qrisBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'flex';
        // Opsional: set animasi amount
        const amountInput = document.getElementById('qrisAmount');
        if (amountInput) amountInput.value = '';
    });

    // Tutup modal
    function closeModal() {
        modal.style.display = 'none';
    }
    if (closeSpan) closeSpan.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Fitur copy teks (nomor VA)
    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = btn.getAttribute('data-copy');
            const textElement = document.getElementById(targetId);
            if (textElement) {
                const text = textElement.innerText;
                navigator.clipboard.writeText(text).then(() => {
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => btn.innerHTML = originalHTML, 1500);
                });
            }
        });
    });

    // Jika gambar qris.png tidak ada, fallback sudah diatur via onerror
}

// Jalankan init saat DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initQrisModal();
});

// Fungsi toggle sidebar mobile
function initMobileSidebar() {
    const hamburger = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');
    if (hamburger && sidebar) {
        hamburger.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
        document.addEventListener('click', function (e) {
            if (window.innerWidth <= 768 && sidebar.classList.contains('open') && !sidebar.contains(e.target) && !hamburger.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }
}
