const HARGA = 5000;

const produk = {
    cookies: {
        nama: "Mango Sago",
        emoji: "🥭"
    },
    semangka: {
        nama: "Lumpia Kulit Tahu",
        emoji: "🫔"
    }// ===================================
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
};

let keranjang = {
    mangga: 0,
    semangka: 0
};

function rupiah(angka) {
    return "Rp" + angka.toLocaleString("id-ID");
}

function tambahPesanan(id) {
    if (keranjang[id] >= 99) {
        alert("Maksimal pemesanan 99 produk per menu.");
        return;
    }

    keranjang[id]++;
    tampilkanKeranjang();
}

function ubahJumlah(id, perubahan) {
    keranjang[id] += perubahan;

    if (keranjang[id] < 0) {
        keranjang[id] = 0;
    }

    tampilkanKeranjang();
}

function hitungJumlah() {
    return keranjang.mangga + keranjang.lumpia;
}

function hitungTotal() {
    return hitungJumlah() * HARGA;
}

function tampilkanKeranjang() {
    const tempat = document.getElementById("keranjang");
    let html = "";

    for (const id in keranjang) {
        const jumlah = keranjang[id];

        if (jumlah > 0) {
            html += `
                <div class="item">
                    <strong>
                        ${produk[id].emoji} ${produk[id].nama}
                    </strong>
                    <br>
                    Harga: ${rupiah(HARGA)}
                    <br>
                    Jumlah:
                    <button type="button"
                        onclick="ubahJumlah('${id}', -1)">−</button>

                    ${jumlah}

                    <button type="button"
                        onclick="ubahJumlah('${id}', 1)">+</button>

                    <br>
                    Subtotal: ${rupiah(jumlah * HARGA)}
                    <br>
                    <button type="button"
                        class="tombol-hapus"
                        onclick="hapusProduk('${id}')">
                        Hapus Produk
                    </button>
                </div>
            `;
        }
    }

    if (hitungJumlah() === 0) {
        tempat.innerHTML = "<p>Keranjang masih kosong.</p>";
        return;
    }

    html += `
        <div class="total">
            Total: ${rupiah(hitungTotal())}
            <br>
            <small style="font-size:14px">
                ${hitungJumlah()} produk
            </small>
        </div>

        <button type="button"
            onclick="location.href='#checkout'">
            Lanjut Checkout →
        </button>
    `;

    tempat.innerHTML = html;
}

function hapusProduk(id) {
    keranjang[id] = 0;
    tampilkanKeranjang();
}

function resetKeranjang() {
    if (hitungJumlah() === 0) {
        alert("Keranjang sudah kosong!");
        return;
    }

    if (!confirm("Yakin ingin menghapus semua pesanan?")) {
        return;
    }

    keranjang = {
        mangga: 0,
        lumpia: 0
    };

    tampilkanKeranjang();
    alert("Semua pesanan berhasil dikosongkan!");
}

document.getElementById("form-pesan").addEventListener(
    "submit",
    function(event) {
        event.preventDefault();

        if (hitungJumlah() === 0) {
            alert("Pilih produk terlebih dahulu!");
            location.href = "#menu";
            return;
        }

        const nama =
            document.getElementById("nama").value.trim();

        const kelas =
            document.getElementById("kelas").value.trim();

        const wa =
            document.getElementById("wa").value.trim();

        const catatan =
            document.getElementById("catatan").value.trim();

        const daftar = [];

        for (const id in keranjang) {
            if (keranjang[id] > 0) {
                daftar.push(
                    produk[id].nama + " x " +
                    keranjang[id] + " = " +
                    rupiah(keranjang[id] * HARGA)
                );
            }
        }

        const pesan =
            "HALO MANGO SAGO & LUMPIA KULIT TAHU! 🥭🫔\n\n" +
            "Saya ingin memesan:\n" +
            daftar.join("\n") + "\n\n" +
            "Total: " + rupiah(hitungTotal()) + "\n\n" +
            "Nama: " + nama + "\n" +
            "Kelas: " + kelas + "\n" +
            "WhatsApp pemesan: " + wa + "\n" +
            "Catatan: " + (catatan || "-");

        // Nomor WhatsApp penjual, tanpa tanda + atau spasi.
        // Ganti jika nomor penjual berbeda.
        const nomorPenjual = "6285850386383";

        const url =
            "https://wa.me/" + nomorPenjual +
            "?text=" + encodeURIComponent(pesan);

        window.open(url, "_blank");
    }
);

tampilkanKeranjang();
