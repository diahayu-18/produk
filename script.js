// ===================================
// PENGATURAN NOMOR WHATSAPP PENJUAL
// ===================================

// Ganti dengan nomor WhatsApp penjual.
// Gunakan kode negara 62, tanpa tanda + atau angka 0 di depan.
const nomorPenjual = "6285850386383";

// ===================================
// DATA PRODUK
// ===================================

const produk = {
    mango: {
        nama: "Mango Sago",
        harga: 8000,
        jumlah: 0
    },

    lumpia: {
        nama: "Lumpia Kulit Tahu",
        harga: 6000,
        jumlah: 0
    }
};

// Format Rupiah
function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
}

// ===================================
// MENGATUR JUMLAH PESANAN
// ===================================

function changeQty(id, perubahan) {
    produk[id].jumlah += perubahan;

    if (produk[id].jumlah < 0) {
        produk[id].jumlah = 0;
    }

    updatePesanan();
}

// ===================================
// UPDATE RINGKASAN PESANAN
// ===================================

function updatePesanan() {
    const mango = produk.mango;
    const lumpia = produk.lumpia;

    const totalMango = mango.jumlah * mango.harga;
    const totalLumpia = lumpia.jumlah * lumpia.harga;

    const totalHarga = totalMango + totalLumpia;

    document.getElementById("qty-mango").textContent =
        mango.jumlah;

    document.getElementById("qty-lumpia").textContent =
        lumpia.jumlah;

    document.getElementById("mango-total").textContent =
        `${mango.jumlah} x ${formatRupiah(mango.harga)}`;

    document.getElementById("lumpia-total").textContent =
        `${lumpia.jumlah} x ${formatRupiah(lumpia.harga)}`;

    document.getElementById("grand-total").textContent =
        formatRupiah(totalHarga);
}

// ===================================
// PROSES PEMESANAN WHATSAPP
// ===================================

document.getElementById("orderForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Ambil data pelanggan
    const nama = document.getElementById("nama").value.trim();
    const nomorWA = document.getElementById("wa").value.trim();
    const catatan = document.getElementById("catatan").value.trim();

    // Periksa nomor WhatsApp penjual
    if (!/^62\d{8,13}$/.test(nomorPenjual)) {
        alert("Nomor WhatsApp penjual belum diatur dengan benar!");
        return;
    }

    // Periksa nomor WhatsApp pelanggan
    const nomorBersih = nomorWA.replace(/[\s-]/g, "");

    if (!/^(\+?62|0)8\d{7,12}$/.test(nomorBersih)) {
        alert("Masukkan nomor WhatsApp yang valid!");
        return;
    }

    // Periksa apakah ada produk yang dipilih
    if (produk.mango.jumlah === 0 &&
        produk.lumpia.jumlah === 0) {

        alert("Silakan pilih minimal satu produk!");
        return;
    }

    // Hitung total
    const totalMango =
        produk.mango.jumlah * produk.mango.harga;

    const totalLumpia =
        produk.lumpia.jumlah * produk.lumpia.harga;

    const totalHarga = totalMango + totalLumpia;

    // Susun daftar pesanan
    let daftarPesanan = "";

    if (produk.mango.jumlah > 0) {
        daftarPesanan +=
            `🥭 ${produk.mango.nama}\n` +
            `Jumlah: ${produk.mango.jumlah}\n` +
            `Harga: ${formatRupiah(totalMango)}\n\n`;
    }

    if (produk.lumpia.jumlah > 0) {
        daftarPesanan +=
            `🥟 ${produk.lumpia.nama}\n` +
            `Jumlah: ${produk.lumpia.jumlah}\n` +
            `Harga: ${formatRupiah(totalLumpia)}\n\n`;
    }

    // Buat pesan WhatsApp
    const pesan =
`🍋 *PESANAN BARU - DAPUR MANIS*

Halo, saya ingin melakukan pemesanan.

👤 *DATA PEMESAN*
Nama: ${nama}
Nomor WhatsApp: ${nomorWA}

🛒 *DETAIL PESANAN*
${daftarPesanan}
💰 *TOTAL PEMBAYARAN*
${formatRupiah(totalHarga)}

📝 *CATATAN*
${catatan || "Tidak ada catatan"}

Terima kasih!`;

    // Kirim ke WhatsApp penjual
    const linkWhatsApp =
        `https://wa.me/${085850386383}?text=${encodeURIComponent(pesan)}`;

    // Buka WhatsApp
    window.location.href = linkWhatsApp;
});

// Tampilkan ringkasan awal
updatePesanan();
