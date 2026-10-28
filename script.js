const HARGA = 5000;

const produk = {
    mango: {
        nama: "Mango Sago",
        emoji: "🧃"
    },
    lumpia: {
        nama: "Lumpia Kulit Tahu",
        emoji: "🫔"
    }
};

let keranjang = {
    mango: 0,
    lumpia: 0,
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
    return keranjang.mango + keranjang.lumpia;
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
        mango: 0,
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
            "HALO MANGO SAGO & LUMPIA KULIT TAHU! 🧃🫔\n\n" +
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
