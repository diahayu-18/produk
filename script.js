
/* =========================================
   THE BAKE & BLEND CO.
   File: script.js
========================================= */

// Ganti dengan nomor WhatsApp toko.
// Contoh: 6281234567890 (tanpa tanda +)
const WHATSAPP_STORE_NUMBER = "6281234567890";

// =========================================
// 1. DATA PRODUK
// =========================================

const products = [
    {
        id: "mango-sago",
        name: "Mango Sago",
        description: "Perpaduan buah & susu segar.",
        price: 8000,
        emoji: "🧃"
    },
    {
        id: "kulit-tahu",
        name: "Lumpia Kulit Tahu",
        description: "Kulit tahu yang renyah & isian ayam dan sayur pilihan.",
        price: 6000,
        emoji: "🫔"
    }
];

// Keranjang belanja
const cart = {};

// Mengambil elemen HTML
const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const navCount = document.getElementById("navCount");
const formMessage = document.getElementById("formMessage");


// =========================================
// 2. FORMAT HARGA RUPIAH
// =========================================

function formatRupiah(amount) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(amount);
}


// =========================================
// 3. MENAMPILKAN DAFTAR PRODUK
// =========================================

function renderProducts() {
    productGrid.innerHTML = products.map(product => `
        <article class="product-card">

            <div class="product-emoji">
                ${product.emoji}
            </div>

            <h3>${product.name}</h3>

            <p>${product.description}</p>

            <div class="price">
                ${formatRupiah(product.price)}
            </div>

            <button
                class="btn add-btn"
                type="button"
                data-add="${product.id}">
                + Tambah ke Keranjang
            </button>

        </article>
    `).join("");
}


// =========================================
// 4. MENGHITUNG JUMLAH PRODUK
// =========================================

function getCartCount() {
    return Object.values(cart).reduce(
        (total, quantity) => total + quantity,
        0
    );
}


// =========================================
// 5. MENGHITUNG TOTAL HARGA
// =========================================

function getCartTotal() {
    return products.reduce((total, product) => {
        const quantity = cart[product.id] || 0;

        return total + (product.price * quantity);
    }, 0);
}


// =========================================
// 6. MENAMPILKAN KERANJANG
// =========================================

function renderCart() {
    const selectedProducts = products.filter(
        product => (cart[product.id] || 0) > 0
    );

    // Update jumlah item pada navbar
    navCount.textContent = getCartCount();

    // Update total harga
    cartTotal.textContent = formatRupiah(getCartTotal());

    // Jika keranjang kosong
    if (selectedProducts.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">
                Keranjang masih kosong.
                Yuk, pilih menu favoritmu! 😊
            </p>
        `;

        return;
    }

    // Menampilkan produk dalam keranjang
    cartItems.innerHTML = selectedProducts.map(product => `
        <div class="cart-item">

            <div>
                <span class="cart-item-title">
                    ${product.emoji} ${product.name}
                </span>

                <span class="cart-item-sub">
                    ${formatRupiah(product.price)}
                    × ${cart[product.id]}
                    = ${formatRupiah(
                        product.price * cart[product.id]
                    )}
                </span>
            </div>

            <div class="quantity">

                <button
                    type="button"
                    data-minus="${product.id}"
                    aria-label="Kurangi ${product.name}">
                    −
                </button>

                <strong>${cart[product.id]}</strong>

                <button
                    type="button"
                    data-add="${product.id}"
                    aria-label="Tambah ${product.name}">
                    +
                </button>

            </div>

            <button
                class="remove-item"
                type="button"
                data-remove="${product.id}"
                aria-label="Hapus ${product.name}">
                ✕
            </button>

        </div>
    `).join("");
}


// =========================================
// 7. MENAMBAHKAN PRODUK KE KERANJANG
// =========================================

productGrid.addEventListener("click", function(event) {
    const button = event.target.closest("[data-add]");

    if (!button) return;

    const productId = button.dataset.add;

    cart[productId] = (cart[productId] || 0) + 1;

    renderCart();

    formMessage.textContent = "";
});


// =========================================
// 8. MENGATUR JUMLAH PRODUK DI KERANJANG
// =========================================

cartItems.addEventListener("click", function(event) {
    const plusButton = event.target.closest("[data-add]");
    const minusButton = event.target.closest("[data-minus]");
    const removeButton = event.target.closest("[data-remove]");

    // Tambah jumlah produk
    if (plusButton) {
        const id = plusButton.dataset.add;

        cart[id] = (cart[id] || 0) + 1;
    }

    // Kurangi jumlah produk
    else if (minusButton) {
        const id = minusButton.dataset.minus;

        cart[id] = Math.max(0, (cart[id] || 0) - 1);

        if (cart[id] === 0) {
            delete cart[id];
        }
    }

    // Hapus produk dari keranjang
    else if (removeButton) {
        const id = removeButton.dataset.remove;

        delete cart[id];
    }

    else {
        return;
    }

    renderCart();
});


// =========================================
// 9. RESET SEMUA PESANAN
// =========================================

document.getElementById("clearCart").addEventListener(
    "click",
    function() {
        Object.keys(cart).forEach(id => {
            delete cart[id];
        });

        renderCart();

        formMessage.textContent = "";
    }
);


// =========================================
// 10. FORM PEMESANAN WHATSAPP
// =========================================

document.getElementById("orderForm").addEventListener(
    "submit",
    function(event) {
        event.preventDefault();

        // Periksa apakah keranjang kosong
        if (getCartCount() === 0) {
            formMessage.textContent =
                "Keranjang masih kosong. Silakan pilih menu terlebih dahulu.";

            document.getElementById("keranjang")
                .scrollIntoView({ behavior: "smooth" });

            return;
        }

        // Ambil data pelanggan
        const name = document
            .getElementById("customerName")
            .value.trim();

        const customerClass = document
            .getElementById("customerClass")
            .value.trim();

        const phone = document
            .getElementById("customerPhone")
            .value.trim();

        const notes = document
            .getElementById("orderNotes")
            .value.trim();

        // Susun daftar pesanan
        const orderLines = products
            .filter(product => (cart[product.id] || 0) > 0)
            .map(product => {
                const quantity = cart[product.id];

                const subtotal = product.price * quantity;

                return `- ${product.name} x${quantity} = ${formatRupiah(subtotal)}`;
            });

        // Buat pesan WhatsApp
        const message = [
            "Halo kakak kakak cantik.!",
            "Saya ingin melakukan pemesanan:",
            "",
            ...orderLines,
            "",
            `Total Pesanan: ${formatRupiah(getCartTotal())}`,
            "",
            "DATA PEMESAN",
            `Nama: ${name}`,
            `Kelas/Instansi: ${customerClass}`,
            `Nomor WhatsApp: ${phone}`,
            `Catatan: ${notes || "-"}`,
            "",
            "Terima kasih!"
        ].join("\n");

        // Validasi nomor WhatsApp toko
        if (
            !/^\d{9,15}$/.test(WHATSAPP_STORE_NUMBER) ||
            WHATSAPP_STORE_NUMBER === "6285850386383"
        ) {
            formMessage.textContent =
                "Silakan ganti nomor WhatsApp toko di script.js dengan nomor yang aktif.";

            return;
        }

        // Buka WhatsApp dengan pesan yang sudah disusun
        const whatsappURL =
            `https://wa.me/${WHATSAPP_STORE_NUMBER}?text=${encodeURIComponent(message)}`;

        window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
        );

        formMessage.textContent =
            "Pesanan sudah disiapkan. Kirim pesan melalui WhatsApp untuk menyelesaikan pemesanan.";
    }
);


// =========================================
// 11. NAVIGASI RESPONSIF
// =========================================

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", function() {
    const isOpen = navMenu.classList.toggle("open");

    menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );
});

// Tutup menu setelah link dipilih
navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function() {
        navMenu.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");
    });
});


// =========================================
// 12. TOMBOL KEMBALI KE ATAS
// =========================================

const backTop = document.getElementById("backTop");

window.addEventListener("scroll", function() {
    backTop.classList.toggle(
        "visible",
        window.scrollY > 400
    );
});

backTop.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


// =========================================
// 13. TAHUN OTOMATIS DI FOOTER
// =========================================

document.getElementById("year").textContent =
    new Date().getFullYear();


// =========================================
// 14. JALANKAN WEBSITE
// =========================================

renderProducts();
renderCart();
